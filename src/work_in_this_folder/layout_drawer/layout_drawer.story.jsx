/* eslint-disable no-alert */
import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, select, boolean } from '@storybook/addon-knobs';
import LayoutDrawer, { Drawer } from '@majik/react-components/src/core/layout_drawer/layout_drawer.jsx';

const style = { width: 600, height: 600 };
const sizeOptions = {
  Hide: 'hide',
  Auto: 'auto',
  Grow: 'grow',
  '200px': 200,
  '100px': 100,
  '50px': 50,
  '10px': 10,
  '100%': '100%',
  '50%': '50%',
  '10%': '10%',
};

storiesOf('Core/Layout Drawer', module)
  .addDecorator(withKnobs)
  .add('Basic Row Layout Drawer', () => {
    const type = boolean('Row', true) ? 'row' : 'column';

    return (
      <div style={{ height: 600, width: 600 }}>
        <LayoutDrawer
          type={type}
          style={style}
        >
          <Drawer size={select('Drawer A', sizeOptions, 'auto')}>
            <div style={{ backgroundColor: 'green', height: 120, width: '100%' }}>
              I am some loooooong string!!!!!!!!!
            </div>
          </Drawer>
          <Drawer size={select('Drawer B', sizeOptions, 200)}>
            <div style={{ backgroundColor: 'blue', height: '100%', width: '100%' }}>
              I am some loooooong string!!!!!!!!!
            </div>
          </Drawer>
          <Drawer size={select('Drawer C', sizeOptions, 'hide')}>
            <div style={{ backgroundColor: 'RED', height: '100%', width: '100%' }}>
              I SHOULD BE HIDDEN
            </div>
          </Drawer>
          <Drawer size={select('Drawer D', sizeOptions, 'grow')}>
            <div style={{ backgroundColor: 'pink', height: '100%', width: '100%' }}>
              I am some loooooong string!!!!!!!!!
            </div>
          </Drawer>
        </LayoutDrawer>
      </div>
    );
  })
  .add('Column Layout Drawer', () => {
    const type = 'column';

    return (
      <LayoutDrawer
        type={type}
        style={style}
      >
        <Drawer size={select('Drawer A', sizeOptions, 'auto')}>
          <div style={{ backgroundColor: 'green', height: '100%', width: 120 }}>
            I am some loooooong string!!!!!!!!!
          </div>
        </Drawer>
        <Drawer size={select('Drawer B', sizeOptions, 200)}>
          <div style={{ backgroundColor: 'blue', height: '100%', width: '100%' }}>
            I am some loooooong string!!!!!!!!!
          </div>
        </Drawer>
        <Drawer size={select('Drawer C', sizeOptions, 'grow')}>
          <div style={{ backgroundColor: 'pink', height: '100%', width: '100%' }}>
            I am some loooooong string!!!!!!!!!
          </div>
        </Drawer>
      </LayoutDrawer>
    );
  })
  .add('Initializing with a hidden drawer', () => {
    const type = boolean('Row', true) ? 'row' : 'column';
    return (
      <LayoutDrawer
        type={type}
        style={style}
      >
        <Drawer size={select('Drawer A', sizeOptions, 'hide')}>
          <div style={{ backgroundColor: 'green', height: 120, width: '100%' }}>
            I am some loooooong string!!!!!!!!!
          </div>
        </Drawer>
        <Drawer size={select('Drawer B', sizeOptions, 'grow')}>
          <div style={{ backgroundColor: 'blue', height: '100%', width: '100%' }}>
            I am some loooooong string!!!!!!!!!
          </div>
        </Drawer>
      </LayoutDrawer>
    );
  })
  .add('with layout drawer in a floating div', () => {
    const type = boolean('Row', true) ? 'row' : 'column';
    return (
      <div style={{ width: 500, height: 650, border: '1px solid #aaa' }}>
        <div style={{ width: 'auto', height: 'auto' }}>
          <LayoutDrawer type={type} style={{ background: '#aaa' }}>
            <Drawer size={select('Drawer A', sizeOptions, 'hide')}>
              <div style={{ backgroundColor: 'green', height: 120, width: '100%' }}>
                I am some loooooong string!!!!!!!!!
              </div>
            </Drawer>
            <Drawer size={select('Drawer B', sizeOptions, 'auto')}>
              <div style={{ backgroundColor: 'blue', height: '100%', width: '100%' }}>
                I am some loooooong string!!!!!!!!!
              </div>
            </Drawer>
          </LayoutDrawer>
        </div>
      </div>
    );
  })
  .add('animating from and to auto', () => {
    const size = boolean('Auto', true) ? 'auto' : 300;
    return (
      <div style={{ width: 500, height: 650, border: '1px solid #aaa' }}>
        <LayoutDrawer type="row" style={{ background: '#aaa' }}>
          <Drawer size={size}>
            <div style={{ backgroundColor: 'green', height: 120, width: '100%' }}>
              I am some loooooong string!!!!!!!!!
            </div>
          </Drawer>
          <Drawer size="grow">
            <div style={{ backgroundColor: 'blue', height: '100%', width: '100%' }}>
              I am some loooooong string!!!!!!!!!
            </div>
          </Drawer>
        </LayoutDrawer>
      </div>
    );
  })
  .add('scrolling with callbacks', () => {
    const scrollBar = boolean('scrollbar', true);
    const row = boolean('row', true);
    return (
      <div style={{ width: 500, height: 550, border: '1px solid #aaa' }}>
        <LayoutDrawer
          scroll
          type={row ? 'row' : 'column'}
          style={{ border: '3px solid #aaa' }}
          onScrolledLeft={() => console.error('left')}
          onScrolledRight={() => console.error('right')}
          onScrolledTop={() => console.error('top')}
          onScrolledBottom={() => console.error('bottom')}
        >
          <Drawer size={200} style={{ border: '1px solid #222' }} />
          <Drawer size={200} style={{ border: '1px solid #222' }} />
          {scrollBar && <Drawer size={200} style={{ border: '1px solid #222' }} />}
          {scrollBar && <Drawer size={200} style={{ border: '1px solid #222' }} />}
          {scrollBar && <Drawer size={200} style={{ border: '1px solid #222' }} />}
          {scrollBar && <Drawer size={200} style={{ border: '1px solid #222' }} />}
        </LayoutDrawer>
      </div>
    );
  });
