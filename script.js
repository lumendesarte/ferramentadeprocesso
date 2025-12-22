document.addEventListener("DOMContentLoaded", () => {

    const botao = document.getElementById("submitBtn");

    botao.addEventListener("click", async () => {

        // Verifica se jsPDF está carregado
        if (!window.jspdf) {
            alert("Erro: jsPDF não foi carregado.");
            return;
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF("p", "mm", "a4");

        // ===============================
        // CAPTURA DOS TEXTOS
        // ===============================
        const title = document.getElementById("title").value || "Projeto";
        const description = document.getElementById("description").value || "";

        let y = 20;

        // TÍTULO
        doc.setFontSize(20);
        doc.text(title, 10, y);
        y += 10;

        // DESCRIÇÃO (com quebra automática de linha)
        doc.setFontSize(12);
        doc.text(description, 10, y, { maxWidth: 190 });
        y += 15;

        // ===============================
        // CAPTURA DAS IMAGENS SELECIONADAS
        // ===============================
        let encontrouImagem = false;

        for (let passo = 1; passo <= 10; passo++) {

            const imagens = document.querySelectorAll(
                `input[name="images${passo}"]:checked`
            );

            if (imagens.length === 0) continue;

            encontrouImagem = true;

            // TÍTULO DO PASSO
            doc.setFontSize(14);
            doc.text(`Passo ${passo}`, 10, y);
            y += 8;

            for (const checkbox of imagens) {

                const img = new Image();
                img.src = "img/" + checkbox.value;

                // Aguarda a imagem carregar
                await img.decode();

                // Converte imagem para base64
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");

                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);

                const imgData = canvas.toDataURL("image/jpeg", 0.9);

                // Quebra de página automática
                if (y + 65 > 280) {
                    doc.addPage();
                    y = 20;
                }

                // Adiciona imagem ao PDF
                doc.addImage(imgData, "JPEG", 10, y, 60, 60);
                y += 65;
            }

            y += 5;
        }

        // ===============================
        // VALIDAÇÃO FINAL
        // ===============================
        if (!encontrouImagem) {
            alert("Selecione pelo menos uma imagem para gerar o PDF.");
            return;
        }

        // ===============================
        // SALVAR PDF
        // ===============================
        doc.save("projeto.pdf");

    });

});


