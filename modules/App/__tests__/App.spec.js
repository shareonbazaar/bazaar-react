// import React from 'react';
// import { shallow } from 'enzyme';
//
// import App from '../App';
// import SideBar from '../../SideBar/SideBar';
//
// const getApp = (props = {}) => shallow(<App {... props} />);
//
// describe('<App />', () => {
//   const mounted = getApp();
//   it('renders children', () => {
//     const child = <div className="foo">bar</div>;
//     mounted.setProps({ children: child });
//     expect(mounted.contains(child)).toBeTruthy();
//   });
//   const sideBar = <SideBar toggled />;
//
//   it('renders <Sidebar> when openSideBar = true', () => {
//     mounted.setState({ openSideBar: true });
//     expect(mounted.contains(sideBar)).toBeTruthy();
//   });
//   it('does not render <Sidebar> when openSideBar = false', () => {
//     mounted.setState({ openSideBar: false });
//     expect(mounted.contains(sideBar)).toBeFalsy();
//   });
// });


// TODO: FIGURE OUT HOW TO TEST REDUX COMPONENTS
