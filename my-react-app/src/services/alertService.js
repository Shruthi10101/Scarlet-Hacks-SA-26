export function compareAgainstBaseline(currentValue, baselineValue) {
  if (!baselineValue) return 0;
  return (currentValue - baselineValue) / baselineValue;
}

export function getWeightedAverage(values = []) {
  if (!values.length) return 0;

  let totalWeight = 0;
  let weightedSum = 0;

  values.forEach((value, index) => {
    const weight = index + 1;
    weightedSum += value * weight;
    totalWeight += weight;
  });

  return weightedSum / totalWeight;
}