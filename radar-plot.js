import elements from './data/dots.json';
import rings from './data/rings.json';
import segments from './data/segments.json';
import { Radar } from './js/radar';
var xmlns = 'http://www.w3.org/2000/svg';

const options = {
  totalAngle: Math.PI,
  padding: 0,
  minPlotRadius: 150,
};

const radar = new Radar(options, { elements, rings, segments });
const radarDiagram = document.getElementById('radar-plot');
const radarContainer = document.getElementById('radar-container');

if (radar.options.totalAngle === Math.PI) {
  radarDiagram.setAttribute('viewBox', '-50 -50 1100 550');
  radarContainer.style.height = '50vw';
} else if (radar.options.totalAngle === Math.PI / 2) {
  radarDiagram.setAttribute('viewBox', '500 -50 550 550');
  radarContainer.style.height = '95vw';
}

radar.ringAxes.forEach((segAxis) => {
  const axis = document.createElementNS(xmlns, 'circle');
  axis.setAttribute('cx', 500);
  axis.setAttribute('cy', 500);
  axis.setAttribute('r', segAxis.j);
  axis.setAttribute('stroke', '#aaa');
  axis.setAttribute('stroke-width', 1);
  axis.setAttribute('fill', '#fff');
  axis.setAttribute('fill-opacity', 0.3);
  radarDiagram.appendChild(axis);
});

radar.segmentAxes.forEach((segAxis) => {
  const axis = document.createElementNS(xmlns, 'line');
  axis.setAttribute('x1', segAxis.axis.x1);
  axis.setAttribute('x2', segAxis.axis.x2);
  axis.setAttribute('y1', segAxis.axis.y1);
  axis.setAttribute('y2', segAxis.axis.y2);
  axis.setAttribute('stroke', '#aaa');
  axis.setAttribute('stroke-width', 1);

  const labelPath = document.createElementNS(xmlns, 'path');
  labelPath.id = 'label-path-' + segAxis.slug;
  labelPath.setAttribute('d', segAxis.axis.labelPath);
  labelPath.setAttribute('fill', 'none');
  labelPath.setAttribute('stroke', segAxis.color);
  labelPath.setAttribute('stroke-width', 15);

  const label = document.createElementNS(xmlns, 'text');
  const labelTextPath = document.createElementNS(xmlns, 'textPath');
  labelTextPath.setAttribute('href', `#label-path-${segAxis.slug}`);
  labelTextPath.innerHTML = segAxis.label;
  labelTextPath.setAttribute('fill', '#555');
  labelTextPath.setAttribute('font-weight', '800');
  labelTextPath.setAttribute(
    'font-size',
    `${radar.options.totalAngle / 3 + 0.5}em`
  );
  labelTextPath.setAttribute('font-family', 'Sans-serif');

  labelTextPath.setAttribute('stroke', segAxis.color);
  labelTextPath.setAttribute('stroke-width', 1);

  labelTextPath.setAttribute('startOffset', '50%');
  labelTextPath.setAttribute('text-anchor', 'middle');
  label.appendChild(labelTextPath);
  radarDiagram.appendChild(labelPath);
  radarDiagram.appendChild(label);
  radarDiagram.appendChild(axis);
});

console.log(radar.dots);

radar.dots.forEach((dot) => {
  const dotEl = document.createElementNS(xmlns, 'g');
  dotEl.setAttribute('style', `transform: translate(${dot.x}px, ${dot.y}px)`);

  radarDiagram.appendChild(dotEl);
  const circle = document.createElementNS(xmlns, 'circle');
  circle.setAttribute('r', dot.r);
  circle.setAttribute('stroke', '#aaa');
  circle.setAttribute('stroke-width', 1);
  circle.setAttribute('fill', dot.color);

  const label = document.createElementNS(xmlns, 'text');
  label.innerHTML = dot.label.substr(0, 1);
  label.setAttribute('font-size', '.5em');
  label.setAttribute('font-family', 'Sans-serif');

  label.style.fill = '#fff';
  label.style.transform = `translate(-3px, 3px)`;

  dotEl.appendChild(circle);
  dotEl.appendChild(label);
});
