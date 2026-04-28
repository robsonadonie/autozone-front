export default function generateInvoiceNumber(lastNumber = 0) {
  const date = new Date();
  let month = date.toLocaleString("fr-FR", { month: "short" }).replace('.', '');
  // Mettre la première lettre en majuscule
 let  month2 = month.charAt(0).toUpperCase() + month.slice(1);
  
  const year = date.getFullYear().toString().slice(-2);
  const nextNumber = Number(lastNumber) + 1;

  return `${month2}-${year}-${nextNumber}`;
}
