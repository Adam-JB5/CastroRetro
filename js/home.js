
export default function home() {
    console.log("homehome");
    fetch('http://127.0.0.1:8080/CastroRetro/api/products', {
  credentials: 'include'
})
.then(res => res.json())
.then(data => {
  console.log("Productos filtrados:", data);
});

}