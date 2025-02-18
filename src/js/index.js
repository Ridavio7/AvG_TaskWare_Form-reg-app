import '../style/style.scss';

window.onload = () => {
    document.getElementById('controller').addEventListener('change', (event) => {
        let controller_num = document.getElementById('controller_num');
        if(event.target.checked === true){
            controller_num.parentElement.style.display = "flex";
        } else if(event.target.checked === false){
            controller_num.parentElement.style.display = "none";
        }
    })
}