import React, {
  useEffect, useRef, useState, useMemo, useCallback,
} from 'react';

import { makeStyles } from '@material-ui/core/styles';


const ZERO = 0.00001;

// const useStyles = makeStyles({
//   drawerClassName: {
//     overflow: 'hidden',
//   },
//   animatedClassName: {
//     transition: 'all .75s ease-out',
//     overflow: 'hidden',
//   },
// });

export default React.memo(Drawer);

function Drawer(props) {
  const {
    children,
    size: sizeProp,
    type,
    className,
    outerClassName,
    outerStyle,
    style: styleProp,
    rootProps,
    minSize,
    maxSize,
    order,
    animate,
    ...restProps
  } = props;

  // consolodate 0 as 'hide'
  const size = useMemo(() => (!sizeProp ? 'hide' : sizeProp), [sizeProp]);

  // prevent content from being crushed when hiding/showing

  //   // non-working logic to allow animations when switching to/from auto
  // const size = useMemo(() => {
  //   // if (lastSize === 'hide' && sizeProp === 'auto') {
  //   //   return type === 'row' ? height : width;
  //   // }
  //   const size = sizeProp;
  //   return size;
  // }, [sizeProp]);

  // const { drawerClassName, animatedClassName } = useStyles();


  const isMounted = useRef(false);
  useEffect(() => { isMounted.current = true; }, []);

  const flex = useMemo(() => {
    if (size === 'hide' || !size) return `${ZERO} ${ZERO} ${ZERO}px`;
    if (size === 'auto') return 'none';
    if (size === 'grow') return 1;
    if (size === 'grow-2') return 2;
    if (size === 'grow-3') return 3;
    if (size === 'grow-4') return 4;
    if (size === 'shrink') return `${ZERO} 1`;
    if (size === 'shrink-2') return `${ZERO} 2`;
    if (typeof size === 'number') return `${ZERO} ${ZERO} ${size}px`;
    if (size.indexOf('%') !== -1) return `${ZERO} ${ZERO} ${size}`;
    return size;
  }, [size]);


  const boxStyle = useMemo(() => {
    const style = {
      ...outerStyle,
    };

    if (size !== 'hide') {
      if (maxSize) {
        style[type !== 'row' ? 'maxWidth' : 'maxHeight'] = maxSize;
      }
      if (minSize) {
        style[type !== 'row' ? 'minWidth' : 'minHeight'] = minSize;
      }
    }

    return {
      order,
      flex,
      ...style,
    };
  }, [flex, maxSize, minSize, order, outerStyle, size, type]);

  return (
    <div
      className={isMounted && outerClassName}
      style={boxStyle}
      {...rootProps}
    >
      <div
        className={'fill ' + className}
        style={{ ...styleProp }}
        {...restProps}
      >
        {children}
      </div>
    </div>
  );
}

Drawer.defaultProps = {
  value: '-',
  type: 'row',
  size: 'grow',
  rootProps: {},
  animate: true,
};
