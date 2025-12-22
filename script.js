document.addEventListener("DOMContentLoaded", () => {

    const botao = document.getElementById("submitBtn");

    botao.addEventListener("click", async () => {

        if (!window.jspdf || !window.html2canvas) {
            alert("Erro ao carregar bibliotecas.");
            return;
        }

        const { jsPDF } = window.jspdf;

        // ===============================
        // 1. ESCONDER IMAGENS NÃO SELECIONADAS
        // ===============================
        const imagensNaoSelecionadas = document.querySelectorAll(
            '.image-options input[type="checkbox"]:not(:checked)'
        );

        const elementosOcultos = [];

        imagensNaoSelecionadas.forEach(cb => {
            const img = cb.closest("label")?.querySelector("img");
            if (img) {
                elementosOcultos.push({ img, display: img.style.display });
                img.style.display = "none";
            }
        });

        // ===============================
        // 2. RENDERIZAR A PÁGINA COMO IMAGEM
        // ===============================
        const container = document.querySelector(".container");

        const canvas = await html2canvas(container, {
            scale: 2,
            useCORS: true,
            backgroundColor: "#ffffff"
        });

        const imgData = canvas.toDataURL("image/jpeg", 0.95);

        // ===============================
        // 3. GERAR PDF
        // ===============================
        const pdf = new jsPDF({
            orientation: "p",
            unit: "px",
            format: [canvas.width, canvas.height]
        });

        pdf.addImage(
            imgData,
            "JPEG",
            0,
            0,
            canvas.width,
            canvas.height
        );

        pdf.save("projeto.pdf");

        // ===============================
        // 4. RESTAURAR IMAGENS OCULTAS
        // ===============================
        elementosOcultos.forEach(({ img, display }) => {
            img.style.display = display;
        });

    });

});
