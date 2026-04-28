import React, { useState } from "react";
import { motion } from "framer-motion";

interface Origin {
  name: string;
  brands: {
    name: string;
    cars: {
      name: string;
      models: string[];
    }[];
  }[];
}

const origins: Origin[] = [
    {
      name: "Japonaise",
      brands: [
        {
          name: "Toyota",
          cars: [
            { name: "Corolla", models: ["LN106", "LN166", "VIGO", "VIGO 2016"] },
            { name: "Hiace", models: ["LN106", "LN166"] },
            { name: "Hilux", models: ["VIGO", "VIGO 2016"] },
            { name: "Yaris", models: ["2017", "2018"] }, // nouveau
            { name: "Land Cruiser", models: ["200", "300"] }, // nouveau
          ],
        },
        {
          name: "Honda",
          cars: [
            { name: "Civic", models: ["2020", "2021"] },
            { name: "Accord", models: ["2019", "2020"] },
            { name: "CR-V", models: ["2020", "2021"] }, // nouveau
          ],
        },
        {
          name: "Nissan",
          cars: [
            { name: "Altima", models: ["2020", "2021"] },
            { name: "Qashqai", models: ["2019", "2020"] },
            { name: "Navara", models: ["D22", "D40"] }, // nouveau
          ],
        },
        {
          name: "Mazda",
          cars: [
            { name: "CX-5", models: ["2018", "2019"] },
            { name: "Mazda3", models: ["2020", "2021"] },
            { name: "BT-50", models: ["2020", "2021"] }, // nouveau
          ],
        },
      ],
    },
    {
      name: "Française",
      brands: [
        {
          name: "Renault",
          cars: [
            { name: "Clio", models: ["IV", "V"] },
            { name: "Megane", models: ["III", "IV"] },
            { name: "Kadjar", models: ["2018", "2019"] }, // nouveau
          ],
        },
        {
          name: "Peugeot",
          cars: [
            { name: "208", models: ["2018", "2019"] },
            { name: "308", models: ["2020", "2021"] },
            { name: "3008", models: ["2019", "2020"] }, // nouveau
          ],
        },
        {
          name: "Citroën",
          cars: [
            { name: "C3", models: ["2019", "2020"] },
            { name: "C4", models: ["2021", "2022"] },
          ],
        },
      ],
    },
    {
      name: "Allemande",
      brands: [
        {
          name: "BMW",
          cars: [
            { name: "X5", models: ["E53", "E70"] },
            { name: "X3", models: ["F25", "G01"] },
            { name: "Serie 3", models: ["F30", "G20"] }, // nouveau
          ],
        },
        {
          name: "Mercedes",
          cars: [
            { name: "C-Class", models: ["W204", "W205"] },
            { name: "E-Class", models: ["W212", "W213"] },
          ],
        },
        {
          name: "Audi",
          cars: [
            { name: "A3", models: ["2019", "2020"] },
            { name: "Q5", models: ["2018", "2019"] },
            { name: "A4", models: ["B9", "B8"] }, // nouveau
          ],
        },
        {
          name: "Volkswagen",
          cars: [
            { name: "Golf", models: ["2018", "2019"] },
            { name: "Passat", models: ["2020", "2021"] },
          ],
        },
      ],
    },
    {
      name: "Coréenne",
      brands: [
        {
          name: "Hyundai",
          cars: [
            { name: "Tucson", models: ["2018", "2019"] },
            { name: "Sonata", models: ["2020", "2021"] },
            { name: "Santa Fe", models: ["2019", "2020"] }, // nouveau
          ],
        },
        {
          name: "Kia",
          cars: [
            { name: "Sportage", models: ["2019", "2020"] },
            { name: "Seltos", models: ["2020", "2021"] },
          ],
        },
      ],
    },
    {
      name: "Américaine",
      brands: [
        {
          name: "Ford",
          cars: [
            { name: "Focus", models: ["2019", "2020"] },
            { name: "F-150", models: ["2021", "2022"] },
            { name: "Mustang", models: ["2020", "2021"] }, // nouveau
          ],
        },
        {
          name: "Chevrolet",
          cars: [
            { name: "Malibu", models: ["2020", "2021"] },
            { name: "Silverado", models: ["2019", "2020"] },
          ],
        },
      ],
    },
    {
      name: "Anglaise",
      brands: [
        {
          name: "Jaguar",
          cars: [
            { name: "F-Type", models: ["2020", "2021"] },
            { name: "XE", models: ["2019", "2020"] },
          ],
        },
        {
          name: "Land Rover",
          cars: [
            { name: "Discovery", models: ["2020", "2021"] },
            { name: "Range Rover", models: ["2019", "2020"] },
          ],
        },
      ],
    },
  ];
  
  

export default function PopupFilter() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOrigin, setSelectedOrigin] = useState<Origin | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedCar, setSelectedCar] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);

  const togglePopup = () => setIsOpen(!isOpen);

  const resetFilters = () => {
    setSelectedOrigin(null);
    setSelectedBrand(null);
    setSelectedCar(null);
    setSelectedModel(null);
  };

  return (
    <div>
      {/* Bouton pour ouvrir le pop-up */}
      <button
        onClick={togglePopup}
        className="bg-[#2A4D9B] text-white px-4 py-1.5 rounded hover:bg-blue-600"
    style={{fontSize:"14px"}}  >
        Ouvrir le filtre
      </button>

      {/* Pop-up */}
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-lg shadow-lg p-6 w-96"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-lg font-bold mb-4">Filtrer par origine</h2>

            {/* Liste des origines */}
            <div>
              <label className="block text-sm font-medium mb-2">Origine</label>
              <select
                onChange={(e) =>
                  setSelectedOrigin(
                    origins.find((origin) => origin.name === e.target.value) || null
                  )
                }
                className="w-full border rounded px-3 py-2"
                value={selectedOrigin?.name || ""}
                style={{fontSize:"14px"}}
              >
                <option value="" style={{fontSize:'14px'}}>Sélectionnez une origine</option>
                {origins.map((origin) => (
                  <option key={origin.name} value={origin.name}>
                    {origin.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Liste des marques */}
            {selectedOrigin && selectedOrigin.brands && (
              <div className="mt-4">
                <label className="block text-sm font-medium mb-2">Marque</label>
                <select
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                  value={selectedBrand || ""}
                  style={{fontSize:"14px"}}
                >
                  <option value="" style={{fontSize:'14px'}}>Sélectionnez une marque</option>
                  {selectedOrigin.brands.map((brand) => (
                    <option key={brand.name} value={brand.name}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Liste des noms de voitures */}
            {selectedBrand &&
              selectedOrigin?.brands.find((brand) => brand.name === selectedBrand)?.cars && (
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-2">Nom de voiture</label>
                  <select
                    onChange={(e) => setSelectedCar(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                    value={selectedCar || ""}
                    style={{fontSize:"14px"}}
                  >
                    <option value="" style={{fontSize:'14px'}}>Sélectionnez un nom de voiture</option>
                    {selectedOrigin.brands
                      .find((brand) => brand.name === selectedBrand)
                      ?.cars.map((car) => (
                        <option key={car.name} value={car.name}>
                          {car.name}
                        </option>
                      ))}
                  </select>
                </div>
              )}

            {/* Liste des modèles */}
            {selectedCar &&
              selectedOrigin?.brands
                .find((brand) => brand.name === selectedBrand)
                ?.cars.find((car) => car.name === selectedCar)?.models && (
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-2">Modèle</label>
                  <select
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                    value={selectedModel || ""}
                    style={{fontSize:"14px"}}
                  >
                    <option value="" style={{fontSize:'14px'}}>Sélectionnez un modèle</option>
                    {selectedOrigin.brands
                      .find((brand) => brand.name === selectedBrand)
                      ?.cars.find((car) => car.name === selectedCar)
                      ?.models.map((model) => (
                        <option key={model} value={model}>
                          {model}
                        </option>
                      ))}
                  </select>
                </div>
              )}

            {/* Badges pour les filtres sélectionnés */}
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Filtres sélectionnés :</h3>
              <div className="flex flex-wrap gap-2">
                {selectedOrigin && (
                  <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm">
                    {selectedOrigin.name}
                  </span>
                )}
                {selectedBrand && (
                  <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm">
                    {selectedBrand}
                  </span>
                )}
                {selectedCar && (
                  <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm">
                    {selectedCar}
                  </span>
                )}
                {selectedModel && (
                  <span className="bg-yellow-100 text-yellow-600 px-3 py-1 rounded-full text-sm">
                    {selectedModel}
                  </span>
                )}
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="mt-6 flex justify-between">
              <button
                onClick={resetFilters}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                style={{fontSize:'14px'}}
              >
                Réinitialiser
              </button>
              <div className="flex gap-4">
                <button
                  onClick={togglePopup}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  style={{fontSize:'14px'}}
                >
                  Fermer
                </button>
                <button
                  onClick={() => alert("Filtre appliqué !")}
                  className="bg-[#2A4D9B] text-white px-4 py-2 rounded hover:bg-[#2a4e9bab]"
                  style={{fontSize:'14px'}}
                >
                  Appliquer
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}