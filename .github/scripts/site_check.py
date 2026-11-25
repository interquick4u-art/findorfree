#!/usr/bin/env python3
"""Проверка, что findorfree.com и форма заявки работают.
Только стандартная библиотека Python. Ничего не отправляет клиентам и не шлёт
настоящих заявок: Web3Forms проверяем запросом без ключа (сервис должен ответить JSON).
Пишет отчёт в report.md; код выхода 1 — есть сбой."""
import json, re, socket, ssl, sys, time, urllib.request, urllib.error
from datetime import datetime, timezone

SITE = "https://findorfree.com"
UA = "FindOrFree-uptime-check (+https://findorfree.com)"
KEY_PAGES = ["/", "/ru/kvartira-za-granitsey.html", "/he/dira-behul.html", "/legal.html", "/tips/", "/apartment-prague.html"]
problems, notes = [], []

def get(url, data=None, timeout=25, tries=3):
    last = None
    for i in range(tries):
        try:
            req = urllib.request.Request(url, data=data, headers={"User-Agent": UA, "Accept": "*/*"})
            with urllib.request.urlopen(req, timeout=timeout) as r:
                return r.status, r.read().decode("utf-8", "replace")
        except urllib.error.HTTPError as e:
            return e.code, e.read().decode("utf-8", "replace")
        except Exception as e:  # сеть, таймаут — повторяем
            last = e
            time.sleep(5 * (i + 1))
    return None, f"{type(last).__name__}: {last}"

# 1. Главные страницы
for p in KEY_PAGES:
    t0 = time.time(); code, body = get(SITE + p); dt = time.time() - t0
    if code != 200:
        problems.append(f"Страница {p}: ответ {code} ({body[:120]})")
    else:
        notes.append(f"{p}: 200, {dt:.1f} с")
        if dt > 10:
            problems.append(f"Страница {p} грузится {dt:.0f} с (медленно)")

# 2. Форма заявки на главной
code, home = get(SITE + "/")
if code == 200:
    if 'id="form"' not in home:
        problems.append('На главной нет формы заявки (id="form")')
    if "api.web3forms.com/submit" not in home:
        problems.append("На главной пропал адрес отправки формы (api.web3forms.com)")
    if not re.search(r'web3formsKey:\s*"[0-9a-f-]{36}"', home):
        problems.append("На главной пропал ключ Web3Forms — заявки не дойдут на почту")
    if 'id="email"' not in home or 'id="req"' not in home:
        problems.append("В форме нет поля почты или поля запроса")

# 3. Сервис Web3Forms жив (запрос без ключа: должен вернуть JSON с success=false)
code, body = get("https://api.web3forms.com/submit", data=b"", timeout=25)
try:
    j = json.loads(body)
    notes.append(f"Web3Forms отвечает ({code}): {str(j.get('message',''))[:80]}")
except Exception:
    problems.append(f"Web3Forms не отвечает как обычно (ответ {code}: {body[:120]}) — заявки с сайта могут не доходить")

# 4. Все страницы из sitemap.xml
code, sm = get(SITE + "/sitemap.xml")
locs = re.findall(r"<loc>([^<]+)</loc>", sm or "") if code == 200 else []
if not locs:
    problems.append(f"sitemap.xml не открылся или пустой (ответ {code})")
bad = []
for u in locs:
    c, _ = get(u, tries=2)
    if c != 200:
        bad.append(f"{u} → {c}")
if bad:
    problems.append("Битые страницы из sitemap: " + "; ".join(bad[:15]))
notes.append(f"sitemap: проверено {len(locs)} страниц, битых {len(bad)}")

# 5. Сертификат HTTPS
try:
    ctx = ssl.create_default_context()
    with socket.create_connection(("findorfree.com", 443), timeout=20) as s:
        with ctx.wrap_socket(s, server_hostname="findorfree.com") as ss:
            exp = datetime.strptime(ss.getpeercert()["notAfter"], "%b %d %H:%M:%S %Y %Z").replace(tzinfo=timezone.utc)
    days = (exp - datetime.now(timezone.utc)).days
    notes.append(f"Сертификат HTTPS действует ещё {days} дн.")
    if days < 14:
        problems.append(f"Сертификат HTTPS истекает через {days} дн.")
except Exception as e:
    problems.append(f"Не удалось проверить HTTPS: {e}")

now = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
lines = [f"Проверка {now}", ""]
if problems:
    lines += ["**Сбой:**", *[f"- {p}" for p in problems], ""]
lines += ["Подробно:", *[f"- {n}" for n in notes]]
open("report.md", "w", encoding="utf-8").write("\n".join(lines) + "\n")
print("\n".join(lines))
sys.exit(1 if problems else 0)
