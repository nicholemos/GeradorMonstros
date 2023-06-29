
    let ndSelect = document.getElementById("nd");
    let nd2Select = document.getElementById("nd2");
    let iniciativaSpan = document.getElementById("iniciativa");
    let percepcaoSpan = document.getElementById("percepcao");
    let ataqueSpan = document.getElementById("ataque");
    let danoSpan = document.getElementById("dano");
    let pvSpan = document.getElementById("pv");
    let defesaSpan = document.getElementById("defesa");
    let fortSpan = document.getElementById("fort");
	let refSpan = document.getElementById("ref");
    let vonSpan = document.getElementById("von");
    let periciasFocadasSpan = document.getElementById("pericias_focadas");
    let outrasPericiasSpan = document.getElementById("outras_pericias");
    let classeDificuldadeSpan = document.getElementById("classe_dificuldade");

    ndSelect.addEventListener("change", function() {
       switch (ndSelect.value) {
    case "1":
        switch (nd2Select.value) {
            case "Lacaio":
                iniciativaSpan.textContent = "4";
                percepcaoSpan.textContent = "0";
                ataqueSpan.textContent = "7";
                danoSpan.textContent = "1d6+3";
                pvSpan.textContent = "10";
                defesaSpan.textContent = "17";
                fortSpan.textContent = "3";
                refSpan.textContent = "4";
                vonSpan.textContent = "1";
                periciasFocadasSpan.textContent = "4";
                outrasPericiasSpan.textContent = "1";
                classeDificuldadeSpan.textContent = "11";
                break;
            case "Solo":
                iniciativaSpan.textContent = "4";
                percepcaoSpan.textContent = "0";
                ataqueSpan.textContent = "7";
                danoSpan.textContent = "1d6+3";
                pvSpan.textContent = "20";
                defesaSpan.textContent = "18";
                fortSpan.textContent = "4";
                refSpan.textContent = "5";
                vonSpan.textContent = "2";
                periciasFocadasSpan.textContent = "5";
                outrasPericiasSpan.textContent = "2";
                classeDificuldadeSpan.textContent = "12";
                break;
        }
        break;
    case "20":
        switch (nd2Select.value) {
            case "Lacaio":
                iniciativaSpan.textContent = "25";
                percepcaoSpan.textContent = "0";
                ataqueSpan.textContent = "50";
                danoSpan.textContent = "6d6+19";
                pvSpan.textContent = "500";
                defesaSpan.textContent = "37";
                fortSpan.textContent = "20";
                refSpan.textContent = "25";
                vonSpan.textContent = "15";
                periciasFocadasSpan.textContent = "35";
                outrasPericiasSpan.textContent = "10";
                classeDificuldadeSpan.textContent = "41";
                break;
            case "Solo":
                iniciativaSpan.textContent = "25";
                percepcaoSpan.textContent = "0";
                ataqueSpan.textContent = "50";
                danoSpan.textContent = "6d6+19";
                pvSpan.textContent = "1000";
                defesaSpan.textContent = "40";
                fortSpan.textContent = "25";
                refSpan.textContent = "30";
                vonSpan.textContent = "20";
                periciasFocadasSpan.textContent = "40";
                outrasPericiasSpan.textContent = "15";
                classeDificuldadeSpan.textContent = "46";
                break;
        }
        break;
}

 
    	function adicionar() {
    var texto = document.getElementById("texto").value;
    if (texto != "") {
      var novoItem = document.createElement("p");
      novoItem.innerHTML = texto + ' <button onclick="apagar(this)">Apagar</button>';
      document.getElementById("dados").appendChild(novoItem);
      document.getElementById("texto").value = "";
    }
  }
  
  function apagar(elemento) {
    elemento.parentNode.remove();
  };
});
    