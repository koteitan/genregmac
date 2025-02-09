const getelem = function(id){
  return document.getElementById(id);
}
const Regmac = function(){
  this.name   = "regmac";
  this.pc     = 0;
  this.outreg = "x";
  this.code   = this.name+"::(Int,Int,Int)->(Int,Int,Int);\n";
}
/* sprintf supports %d and %+Nd and %Ns and %s */
const sprintf = function(fmt, ...args){
  // at first diverge %d and %+Nd and %Ns and %s
  let s = fmt;
  let i = 0;
  let digits = 0;
  let isplus = false;
  while(s.indexOf('%') != -1){
    const p = s.indexOf('%');
    const c = s[p+1];
    if('0123456789'.indexOf(c) != -1){
      digits = parseInt(c)+digits*10;
      s = s.substring(0,p)+"%"+s.substring(p+2);
    }else if(c == '+'){
      isplus = true;
      s = s.substring(0,p)+"%"+s.substring(p+2);
    }else if(c == 'd'){
      const v = args[i++];
      const padstr = ' '.repeat(digits-String(v).length);
      const sign = isplus && v >= 0 ? '+' : '';
      s = s.substring(0,p)+sign+padstr+v+s.substring(p+2);
      digits = 0;
      isplus = false;
    }else if(c == 's'){
      const v = args[i++];
      let padstr = '';
      if(digits > v.length){
        padstr = ' '.repeat(digits-v.length);
      }
      s = s.substring(0,p)+v+padstr+s.substring(p+2);
      digits = 0;
      ispuls = false;
    }else{
      s = s.substring(0,p)+s.substring(p+1);
    }
  }
  return s;
}
Regmac.prototype.genmodk = function(m){
  let ipc = this.pc;
  let opc = ipc;
  let lpc = ipc+m*2;
  const name = this.name;
  for(let k=0; k<m; k++){
    const r = k==0 ? 0 : 1;
    if(this.outreg == 'x'){
      this.code += sprintf("%3s  (%3d,0,y)=%s(%3d,0  ,y  );\n", name, opc, name, lpc+r);
      this.code += sprintf("%3s  (%3d,x,y)=%s(%3d,x-1,y  );\n", name, opc++, name, opc);
      this.code += sprintf("%3s  (%3d,x,y)=%s(%3d,x  ,y+1);\n", name, opc++, name, opc);
    }else{                                             
      //this.code += name+"  ("+sppc(opc)+",x,0)="+name+"("+sppc(lpc+r)+",x  ,0  );\n";
      //this.code += name+"  ("+sppc(opc)+",x,y)="+name+"("+sppc(opc++)+",x  ,y-1);\n";
      //this.code += name+"  ("+sppc(opc)+",x,y)="+name+"("+sppc(opc++)+",x+1,y  );\n";
      this.code += sprintf("%3s  (%3d,x,0)=%s(%3d,x  ,0  );\n", name, opc, name, lpc+r);
      this.code += sprintf("%3s  (%3d,x,y)=%s(%3d,x  ,y-1);\n", name, opc++, name, opc);
      this.code += sprintf("%3s  (%3d,x,y)=%s(%3d,x+1,y  );\n", name, opc++, name, opc);
    }
  }
  this.pc = lpc;
  this.outreg = this.outreg=='x' ? 'y' : 'x';
};
Regmac.prototype.genmulk = function(m){
  let ipc = this.pc;
  let opc = ipc;
  let lpc = ipc+m+2;
  const name = this.name;
  if(this.outreg == 'x'){
    this.code += sprintf("%3s  (%3d,0,y)=%s(%3d,0  ,y  );\n", name, opc  , name, lpc);
    this.code += sprintf("%3s  (%3d,x,y)=%s(%3d,x-1,y  );\n", name, opc++, name, opc);
  }else{                                             
    this.code += sprintf("%3s  (%3d,x,0)=%s(%3d,x  ,0  );\n", name, opc  , name, lpc);
    this.code += sprintf("%3s  (%3d,x,y)=%s(%3d,x  ,y-1);\n", name, opc++, name, opc);
  }
  for(let k=0; k<m; k++){
    if(this.outreg == 'x'){
      this.code += sprintf("%3s  (%3d,x,y)=%s(%3d,x  ,y+1);\n", name, opc++, name, opc);
    }else{                                             
      this.code += sprintf("%3s  (%3d,x,y)=%s(%3d,x+1,y  );\n", name, opc++, name, opc);
    }
  }
  this.pc = lpc;
  this.outreg = this.outreg=='x' ? 'y' : 'x';
}
window.onload = function(){
  const regmac = new Regmac();
  regmac.genmulk(3);
  getelem('debug').innerHTML = regmac.code;
}

