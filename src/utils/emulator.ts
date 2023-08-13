
const minTemp = 36,
  maxTemp = 41,
  minSpo2 = 95,
  maxSpo2 = 100,
  minHP = 60,
  maxHP = 70;

const data = {
  temp: minTemp + (maxTemp - minTemp) * Math.random(),
  spo2: minSpo2 + (maxSpo2 - minSpo2) * Math.random(),
  HP: minHP + (maxHP - minHP) * Math.random(),
};

function genNextValue(prevValue: number, min: number, max: number) {
  let value = prevValue + (max - min) * (Math.random() - 0.5) * 0.03;
  value = Math.max(min, Math.min(max, value));
  return Math.round(value * 10) / 10;
}

export function publishTelemetry() {
  data.temp = genNextValue(data.temp, minTemp, maxTemp);
  data.spo2 = genNextValue(data.spo2, minSpo2, maxSpo2);
  data.HP = genNextValue(data.HP, minHP, maxHP);
  
  console.log(JSON.stringify(data));

  return data;
}