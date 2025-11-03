export function onlyDigits(s) { return String(s||'').replace(/\D+/g, '') }

export function maskCPF(v) {
  const d = onlyDigits(v).slice(0,11)
  return d.replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2')
}
export function isValidCPF(v) {
  const s = onlyDigits(v); if (s.length !== 11 || /^([0-9])\1{10}$/.test(s)) return false
  let sum=0, rest; for (let i=1;i<=9;i++) sum += parseInt(s.substring(i-1,i))*(11-i); rest=(sum*10)%11; if (rest===10||rest===11) rest=0; if (rest!==parseInt(s.substring(9,10))) return false
  sum=0; for (let i=1;i<=10;i++) sum += parseInt(s.substring(i-1,i))*(12-i); rest=(sum*10)%11; if (rest===10||rest===11) rest=0; return rest===parseInt(s.substring(10,11))
}

export function maskCNPJ(v) {
  const d = onlyDigits(v).slice(0,14)
  return d.replace(/(\d{2})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1/$2').replace(/(\d{4})(\d{1,2})$/, '$1-$2')
}
export function isValidCNPJ(v) {
  const c = onlyDigits(v); if (c.length!==14) return false
  let t=c.length-2, d=c.substring(t), d1=parseInt(d.charAt(0)), d2=parseInt(d.charAt(1)), calc=x=>{let n=0,p=t-7; for(let i=t;i>=1;i--) n+=c.charAt(t-i)*p--; return n}, n=calc(t), dv=11-n%11; dv=dv>9?0:dv; if(dv!=d1) return false; t=t+1; n=calc(t); dv=11-n%11; dv=dv>9?0:dv; return dv==d2
}

export function maskPhone(v) {
  const d = onlyDigits(v).slice(0,11)
  if (d.length <= 10) return d.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3')
  return d.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3')
}

export async function fetchCEP(cep) {
  const d = onlyDigits(cep)
  if (d.length !== 8) throw new Error('CEP inválido')
  const res = await fetch(`https://viacep.com.br/ws/${d}/json/`)
  if (!res.ok) throw new Error('Falha ao buscar CEP')
  const json = await res.json()
  if (json.erro) throw new Error('CEP não encontrado')
  return json // { logradouro, bairro, localidade, uf }
}
