document.addEventListener("DOMContentLoaded", () => {

  const botao = document.getElementById("submitBtn");

  botao.addEventListener("click", async () => {

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF("p", "mm", "a4");

    let y = 20;

    // ===============================
    // TÍTULO E DESCRIÇÃO
    // ===============================
    const title = document.getElementById("title").value || "Projeto";
    const description = document.getElementById("description").value || "";

    doc.setFontSize(20);
    doc.text(title, 10, y);
    y += 12;

    doc.setFontSize(12);
    doc.text(description, 10, y, { maxWidth: 190 });
    y += 15;

    // ===============================
    // TODAS AS SEÇÕES
    // ===============================
    const sections = document.querySelectorAll(".section");

    for (const section of sections) {

      // Quebra de página preventiva
      if (y > 260) {
        doc.addPage();
        y = 20;
      }

      // ===============================
      // TÍTULO DA SEÇÃO (h2)
      // ===============================
      const h2 = section.querySelector("h2");
      if (h2) {
        doc.setFontSize(16);
        doc.text(h2.innerText, 10, y);
        y += 8;
      }

      // ===============================
      // SUBTÍTULOS (h3)
      // ===============================
      const h3s = section.querySelectorAll("h3");
      for (const h3 of h3s) {
        doc.setFontSize(13);
        doc.text(h3.innerText, 12, y);
        y += 7;
      }

      // ===============================
      // PARÁGRAFOS (p)
      // ===============================
      const paragraphs = section.querySelectorAll("p");
      doc.setFontSize(11);

      for (const p of paragraphs) {
        doc.text(p.innerText, 12, y, { maxWidth: 186 });
        y += 6;

        if (y > 270) {
          doc.addPage();
          y = 20;
        }
      }

      y += 5;

      // ===============================
      // IMAGENS SELECIONADAS (checked)
      // ===============================
      const images = section.querySelectorAll(
        'input[type="checkbox"]:checked'
      );

      for (const checkbox of images) {

        const img = new Image();
        img.src = checkbox.value;

        await img.decode();

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const imgData = canvas.toDataURL("image/jpeg", 0.85);

        if (y + 60 > 280) {
          doc.addPage();
          y = 20;
        }

        doc.addImage(imgData, "JPEG", 10, y, 60, 60);
        y += 65;
      }

      y += 10;
    }

    // ===============================
    // SALVAR PDF
    // ===============================
    doc.save("projeto-completo.pdf");

  });

});
