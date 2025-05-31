'use client';

import { useEffect } from 'react';
import { select } from 'd3-selection';
import { geoPath, geoMercator } from 'd3-geo';
import { json } from 'd3-fetch';

const Map = () => {
  useEffect(() => {
    const width = document.querySelector('#vizMap').clientWidth;
    const height = 500;
    const svg = select('#indonesiaMap').attr('viewBox', [0, 0, width, height]);

    const projection = geoMercator().center([0, 0]);
    const pathGenerator = geoPath().projection(projection);

    function mouseOverHandle() {
      select(this).style('fill', '#017534');
    }

    function mouseOutHandle() {
      select(this).style('fill', '#abcfb4');
    }

    const generateMap = (geoJSON) => {
      const gMap = svg.append('g').attr('id', 'map');
      gMap
        .selectAll('path')
        .data(geoJSON.features)
        .join('path')
        .attr('d', (d) => pathGenerator(d));

      gMap
        .selectAll('path')
        .on('mouseover', mouseOverHandle)
        .on('mouseout', mouseOutHandle)
        // .on('click', clickHandle)
        .style('cursor', 'pointer');
    };

    // get geoJSON data
    Promise.all([json('/indonesia-old.json')]).then(([indonesia]) => {
      projection.fitSize([width, height], indonesia);
      generateMap(indonesia);
    });
  }, []);

  return (
    <div className="relative pt-32 px-5" id="vizMap">
      <svg id="indonesiaMap" />
    </div>
  );
};

export default Map;
