document.addEventListener("DOMContentLoaded", () => {

  const botao = document.getElementById("submitBtn");

  botao.addEventListener("click", async () => {

    // ===============================
    // VERIFICAÇÃO DE BIBLIOTECAS
    // ===============================
    if (!window.jspdf || !window.html2canvas) {
      alert("Erro ao carregar jsPDF ou html2canvas.");
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
        elementosOcultos.push({
          img,
          display: img.style.display
        });
        img.style.display = "none";
      }
    });

    // ===============================
    // 2. CRIAR PDF
    // ===============================
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const margin = 10;
    const maxWidth = pageWidth - margin * 2;
    const maxHeight = pageHeight - margin * 2;

    let primeiraPagina = true;

    // ===============================
    // 3. RENDERIZAR CADA SEÇÃO
    // ===============================
    const sections = document.querySelectorAll(".section");

    for (const section of sections) {

      const canvas = await html2canvas(section, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff"
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.95);

      let imgWidth = maxWidth;
      let imgHeight = (canvas.height * imgWidth) / canvas.width;

      // 🔒 GARANTE QUE A SEÇÃO CABE INTEIRA NA PÁGINA
      if (imgHeight > maxHeight) {
        const ratio = maxHeight / imgHeight;
        imgHeight = maxHeight;
        imgWidth = imgWidth * ratio;
      }

      if (!primeiraPagina) {
        pdf.addPage();
      }
      primeiraPagina = false;

      pdf.addImage(
        imgData,
        "JPEG",
        (pageWidth - imgWidth) / 2,
        margin,
        imgWidth,
        imgHeight
      );
    }

    // ===============================
    // 4. SALVAR PDF
    // ===============================
    pdf.save("projeto.pdf");

    // ===============================
    // 5. RESTAURAR IMAGENS OCULTAS
    // ===============================
    elementosOcultos.forEach(({ img, display }) => {
      img.style.display = display;
    });

  });

});
