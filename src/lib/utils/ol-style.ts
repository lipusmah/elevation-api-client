import pinIcon from '$lib/assets/icons/pin.svg';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import Circle from 'ol/style/Circle';

import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';

export const lineStyle = [
    new Style({ stroke: new Stroke({ color: 'rgba(255,255,255,1)', width: 5 }) }),
    new Style({ stroke: new Stroke({ color: 'rgba(0,0,0,1)', width: 2 }) })
];

export const drawStyle = [
    new Style({
        image: new Circle({
            radius: 2,
            fill: new Fill({ color: '#FFFFFF' })
        })
    })
]

export const pinStyle = [
    new Style({
        image: new Icon({
            src: pinIcon,
            anchor: [0.5, 1],
            color: 'black'
        })
    }),
    new Style({
        image: new Circle({
            radius: 3,
            fill: new Fill({
                color: '#fff'
            }),
            stroke: new Stroke({
                width: 2,
                color: "black"
            })
        })
    })
]