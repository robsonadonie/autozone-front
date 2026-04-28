
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// Sample data - In a real app, this would come from your backend
const data = [
  { name: "Électronique", value: 185 },
  { name: "Meubles", value: 120 },
  { name: "Livres", value: 260 },
  { name: "Vêtements", value: 140 },
  { name: "Nourriture", value: 95 },
  { name: "Autres", value: 75 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border border-border rounded shadow-sm">
        <p className="font-medium">{`${label}`}</p>
        <p className="text-sm text-secondary">{`Quantité: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

const InventorySummaryChart = () => {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Résumé de l'inventaire</CardTitle>
        <CardDescription>Répartition du stock par catégorie</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 25,
              }}
            >
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                tick={{ fontSize: 12 }}
                tickLine={false}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" fill="#3065a3" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default InventorySummaryChart;
