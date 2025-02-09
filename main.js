const genmodk = function(pc, m, input){
  let str = "";
  for(let k=0; k<m; k++){
    if(input=='x'){
      str += "regmac("+(pc+0)+",x,y)=regmac("+(pc+1)+",x-1,y  );\n";
      str += "regmac("+(pc+1)+",x,y)=regmac("+(pc+0)+",x  ,y+1);\n";
  }
};


