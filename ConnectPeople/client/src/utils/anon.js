// Simple anonymous username generator
const adjectives = ['Warm','Calm','Quiet','Gentle','Bright','Kind','Mellow','Cozy'];
const animals = ['TeaLeaf','Mug','Kettle','Sparrow','Fox','Heron','Panda','Otter'];

export function generateAnon() {
  const a = adjectives[Math.floor(Math.random()*adjectives.length)];
  const b = animals[Math.floor(Math.random()*animals.length)];
  const num = Math.floor(Math.random()*900)+100;
  return `${a}${b}${num}`;
}

export function logout() {
  localStorage.removeItem('tt_token');
  localStorage.removeItem('tt_user');
}
