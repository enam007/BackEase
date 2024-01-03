// draw.js

export const calculateAngle = ({ pointA, pointB, pointC }) => {
  const vectorAB = { x: pointB.x - pointA.x, y: pointB.y - pointA.y };
  const vectorBC = { x: pointB.x - pointC.x, y: pointB.y - pointC.y };

  const dotProduct = vectorAB.x * vectorBC.x + vectorAB.y * vectorBC.y;
  const magnitudeAB = Math.sqrt(vectorAB.x ** 2 + vectorAB.y ** 2);
  const magnitudeBC = Math.sqrt(vectorBC.x ** 2 + vectorBC.y ** 2);

  const cosineTheta = dotProduct / (magnitudeAB * magnitudeBC);

  // Ensure the value is within the valid range for arccosine
  const safeCosineTheta = Math.max(-1, Math.min(1, cosineTheta));

  // Calculate the angle in radians
  const angleRadians = Math.acos(safeCosineTheta);

  // Convert radians to degrees
  const angleDegrees = (angleRadians * 180) / Math.PI;

  return angleDegrees;
};
