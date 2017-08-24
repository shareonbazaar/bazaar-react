import React from 'react';
import { shallow } from 'enzyme';

import CircularImage from '../../CircularImage/CircularImage';

const getCircularImage = (props = {}) => shallow(<CircularImage imageUrl="51er" {...props} />);

describe('<CircularImage />', () => {
  const mounted = getCircularImage();
  const image = <img src="yo" alt="" />;
  mounted.setProps({ imageUrl: 'yo' });
  it('renders correct <img /> with right imageUrl', () => {
    expect(mounted.contains(image)).toBeTruthy();
  });
  it('renders <div className="circular-img">', () => {
    expect(mounted.contains(<div className="circular-img">{image}</div>)).toBeTruthy();
  });
});
