import React, { useMemo, forwardRef } from 'react';
import Drawer from './drawer.jsx';
import layoutStyle from './layout_style.css';

const LayoutDrawerMemo = React.memo(forwardRef(LayoutDrawer));

export { Drawer, LayoutDrawerMemo as LayoutDrawer };
export default LayoutDrawerMemo;

function LayoutDrawer(props, ref) {
  const {
    type,
    children: childrenProp,
    className,
    scroll,
    style: styleProp,
    size,
    gapSize,
    noFill,
    wrap,
    onScrolledLeft,
    onScrolledRight,
    onScrolledTop,
    onScrolledBottom,
    onScroll: onScrollProp,
    onWheel: onWheelProp,
    ...restProps
  } = props;


  const children = useMemo(() => React.Children
    .toArray(childrenProp)
    .filter(a => a)
    .map(child => React.cloneElement(child, {
      ...child.props,
      type,
      outerStyle: {
        [type === 'row' ? 'marginBottom' : 'marginRight']: gapSize,
        ...child.props && child.props.outerStyle,
      },
      // size: child.props.size || size,
    })),
    [childrenProp, gapSize, type]);

  const layoutDrawerStyles = useMemo(() => {
    var x = type === "column" ? {
      display: "flex",
      flexDirection: "row",
      overflow: "auto",
    } : {
        display: "flex",
        flexDirection: "column",
        overflow: "auto",
      }

    return {
      overflow: scroll ? 'auto' : 'hidden',
      flexWrap: wrap ? 'wrap' : 'nowrap',
      ...styleProp,
      ...x
    }
  }, [scroll, styleProp, wrap]);


  return (
    <div
      ref={ref}
      style={layoutDrawerStyles}
      className={(noFill ? '' : 'fill ') + className + " " + type === 'row' ? layoutStyle.mainContainerRow : layoutStyle.mainContainerColumn}
      {...restProps}
    >
      {children}
    </div>
  );
}

LayoutDrawer.defaultProps = {
  type: 'row',
  noFill: false,
};
