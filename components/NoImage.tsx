export default function NoImage() {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      minHeight: '220px',
      background: 'linear-gradient(135deg, #0000A2, #0a73ce)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{position:'absolute', width:'300px', height:'300px', borderRadius:'50%', background:'rgba(255,255,255,0.04)', top:'-80px', right:'-60px'}}/>
      <div style={{position:'absolute', width:'200px', height:'200px', borderRadius:'50%', background:'rgba(255,255,255,0.04)', bottom:'-40px', left:'-40px'}}/>
      <img src='/logo.png' alt='Acontecer' style={{width:'200px', objectFit:'contain', position:'relative', zIndex:1}} />
    </div>
  );
}

