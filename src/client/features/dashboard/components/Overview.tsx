import {
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Line,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import {} from "recharts";

const colors = ["#8884d8", "#82ca9d", "#facc15", "#FF0000"];

export default function Overview({
  data,
}: {
  data: Record<string, Array<Record<string, number | string> | string>>;
}) {
  return (
    <>
      {data.content?.length === 0 && (
        <h1 className="w-full  text-center text-lg text-muted-foreground font-semibold">
          No data to display
        </h1>
      )}
      <ResponsiveContainer width="100%" height={350}>
        <LineChart
          width={730}
          height={250}
          data={data.content}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          {(data.entries as string[]).map((entry, index) => (
            <Line
              key={index}
              type="monotone"
              dataKey={entry}
              stroke={colors[index]}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </>
  );
}
