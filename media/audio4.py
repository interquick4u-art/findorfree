# ASMR sound track for format v3. python3 audio4.py events_<name>.json out.wav
import sys,json,wave,numpy as np
SR=44100;D=10.0;rng=np.random.default_rng(7)
buf=np.zeros(int(SR*D)+SR)
def add(t,x,g=1.0):
    i=int(t*SR);n=min(len(x),len(buf)-i)
    if n>0:buf[i:i+n]+=x[:n]*g
def env(n,a=0.002,d=30):
    t=np.arange(n)/SR;return np.minimum(t/a,1)*np.exp(-t*d)
def noise(n):return rng.standard_normal(n)
def bp(x,lo,hi):
    X=np.fft.rfft(x);f=np.fft.rfftfreq(len(x),1/SR);X[(f<lo)|(f>hi)]=0;return np.fft.irfft(X,len(x))
def tone(f,n,d):
    t=np.arange(n)/SR;return np.sin(2*np.pi*f*t)*np.exp(-t*d)
def key(deep=False,sp=False):
    n=int(SR*0.09);v=rng.uniform(0.9,1.1)
    x=bp(noise(n),1800*v,7000)*env(n,0.0006,95)*1.2
    x+=tone((150 if deep else 330)*v,n,60)*(1.1 if deep else 0.5)
    k=int(SR*0.045);y=bp(noise(n),2500,9000)*env(n,0.0006,140)*0.45   # key release
    out=np.zeros(n+k);out[:n]+=x;out[k:]+=y
    if sp:out=out*0.9+np.pad(tone(110,n,45)*0.5,(0,k))
    return out
def click():
    n=int(SR*0.05);x=bp(noise(n),3000,10000)*env(n,0.0004,180)+tone(2100,n,160)*0.6
    k=int(SR*0.06);out=np.zeros(n+k);out[:n]+=x;out[k:]+=x*0.6;return out
def whoosh(d=0.3,lo=400,hi=5000,up=True):
    n=int(SR*d);x=noise(n);t=np.arange(n)/n;out=np.zeros(n);B=24
    for b in range(B):
        a,z=int(n*b/B),int(n*(b+1)/B);p=(b+0.5)/B;c=lo*(hi/lo)**(p if up else 1-p)
        seg=bp(x,c*0.6,c*1.6)[a:z];out[a:z]=seg
    return out*np.sin(np.pi*t)**1.5*1.4
def riser(d):
    n=int(SR*d);t=np.arange(n)/SR;f=180*(6.0)**(t/d);ph=2*np.pi*np.cumsum(f)/SR
    x=(np.sin(ph)+0.4*np.sin(2*ph))*(t/d)**1.6*0.5
    x+=bp(noise(n),2000,9000)*(t/d)**3*0.35
    return x
def bell(f,d=1.2,dec=4.5):
    n=int(SR*d);return tone(f,n,dec)+0.5*tone(f*2.76,n,dec*1.6)+0.25*tone(f*5.4,n,dec*2.5)
def hit():
    n=int(SR*1.6);t=np.arange(n)/SR
    x=np.sin(2*np.pi*(55+90*np.exp(-t*18))*t)*np.exp(-t*6)*1.6        # boom
    x[:int(SR*0.08)]+=bp(noise(int(SR*0.08)),200,6000)*env(int(SR*0.08),0.0005,50)*1.2
    b=np.zeros(n);b1=bell(1318.5);b2=bell(1975.5);b3=bell(2637)
    b[:len(b1)]+=b1*0.5;o=int(SR*0.09);b[o:o+len(b2)]+=b2[:n-o]*0.45;o=int(SR*0.18);b[o:o+len(b3)]+=b3[:n-o]*0.4
    return x+b
def cash():
    n=int(SR*0.9);out=np.zeros(n)
    k=int(SR*0.07);out[:k]+=bp(noise(k),1500,8000)*env(k,0.0005,60)*1.0+tone(190,k,40)*0.9   # drawer thud "ka"
    for i,(o,f) in enumerate([(0.10,2093),(0.105,3136),(0.11,4186)]):
        s=int(SR*o);b=bell(f,0.75,6);out[s:s+len(b)]+=b[:n-s]*0.38                             # "ching"
    for j in range(5):                                                                           # coin rattle
        s=int(SR*(0.2+j*0.045));c=tone(5200+rng.uniform(-600,600),int(SR*0.05),70)*0.12;out[s:s+len(c)]+=c
    return out
def pop():
    n=int(SR*0.12);t=np.arange(n)/SR;return np.sin(2*np.pi*(700-380*t/0.12)*t)*np.exp(-t*30)*0.9
ev=json.load(open(sys.argv[1]))
for k,t in ev:
    if k=='key':add(t,key(),0.55)
    elif k=='space':add(t,key(sp=True),0.6)
    elif k=='enter':add(t,key(deep=True),1.0);add(t,tone(98,int(SR*0.2),25),0.8)
    elif k=='whoosh':add(t-0.06,whoosh(0.3),0.55)
    elif k=='whoosh2':add(t-0.05,whoosh(0.32,300,3500,up=False),0.5)
    elif k=='tick':add(t,key(),0.22)
    elif k=='click':add(t,click(),0.6)
    elif k=='riser':add(t,riser(1.1),0.8)
    elif k=='hit':add(t,hit(),0.75)
    elif k=='stamp':add(t,cash(),0.9)
    elif k=='pop':add(t,pop(),0.5)
# soft room tone so silence isn't digital zero
buf+=bp(noise(len(buf)),80,900)*0.004
x=buf[:int(SR*D)];x=np.tanh(x*1.3);x/=max(1e-9,np.abs(x).max());x*=0.93
x[-int(SR*0.04):]*=np.linspace(1,0,int(SR*0.04));x[:int(SR*0.004)]*=np.linspace(0,1,int(SR*0.004))
w=wave.open(sys.argv[2],'wb');w.setnchannels(1);w.setsampwidth(2);w.setframerate(SR);w.writeframes((x*32767).astype('<i2').tobytes());w.close()
