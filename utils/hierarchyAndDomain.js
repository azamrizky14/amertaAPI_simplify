const findByHierarchyAndDomain = async (hierarchy, domain, limit) => {
    // Konversi domain ke angka jika memungkinkanconst convertedDomain = [];
    const convertedDomain = [];
    // Split data berdasarkan koma
    const domainParts = domain.split(",");

    // Iterasi setiap elemen dan konversi ke angka jika mungkin
    domainParts.forEach((part) => {
      const trimmedPart = part.trim(); // Menghapus spasi
      const numberPart = Number(trimmedPart);

      if (!isNaN(numberPart)) {
        // Jika elemen dapat dikonversi ke angka
        convertedDomain.push(numberPart);
      } else {
        // Jika tidak bisa dikonversi, simpan sebagai string
        convertedDomain.push(trimmedPart);
      }
    });

    // Check hierarchy and adjust the query accordinglys
      
        if (hierarchy && parseFloat(hierarchy) > limit) {
      return convertedDomain; // Cari dengan nilai tunggal
    } else {
      return { $in: convertedDomain }; // Gunakan $in untuk array
    }
  }

  module.exports = { findByHierarchyAndDomain };