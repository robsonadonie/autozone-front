import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ProductTables = () => {
  const products = [
    {
      id: 1,
      name: "Filtre à huile Bosch F026407123",
      category: "Filtration",
      price: "12.50 €",
      stock: 3,
      status: "Bas",
      manufacturer: "Bosch",
    },
    {
      id: 2,
      name: "Plaquettes de frein ATE 13.0460-7186.2",
      category: "Freinage",
      price: "59.99 €",
      stock: 2,
      status: "Bas",
      manufacturer: "ATE",
    },
    {
      id: 3,
      name: "Courroie distribution Gates K015603XS",
      category: "Moteur",
      price: "79.90 €",
      stock: 0,
      status: "Rupture",
      manufacturer: "Gates",
    },
    {
      id: 4,
      name: "Liquide de frein DOT 4",
      category: "Fluides",
      price: "15.50 €",
      stock: 12,
      status: "Normal",
      manufacturer: "TotalEnergies",
    },
  ];

  return (
    <div className="bg-white rounded-md shadow">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Catégorie</TableHead>
            <TableHead>Prix</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Fabricant</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell>{product.price}</TableCell>
              <TableCell>{product.stock}</TableCell>
              <TableCell>
                <span
                  className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                    product.status === "Normal"
                      ? "bg-green-100 text-green-800"
                      : product.status === "Bas"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {product.status}
                </span>
              </TableCell>
              <TableCell>{product.manufacturer}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProductTables;