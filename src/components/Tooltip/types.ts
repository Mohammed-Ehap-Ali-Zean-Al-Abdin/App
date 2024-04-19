import type {ReactNode} from 'react';
import type React from 'react';
import type {StyleProp, ViewStyle} from 'react-native';
import type ChildrenProps from '@src/types/utils/ChildrenProps';

type SharedTooltipProps = {
    /** The text to display in the tooltip. If text is ommitted, only children will be rendered. */
    text?: string;

    /** Maximum number of lines to show in tooltip */
    numberOfLines?: number;

    /** Any additional amount to manually adjust the horizontal position of the tooltip.
    A positive value shifts the tooltip to the right, and a negative value shifts it to the left. */
    shiftHorizontal?: number | (() => number);

    /** Any additional amount to manually adjust the vertical position of the tooltip.
    A positive value shifts the tooltip down, and a negative value shifts it up. */
    shiftVertical?: number | (() => number);

    /** Number of pixels to set max-width on tooltip  */
    maxWidth?: number;

    /** Render custom content inside the tooltip. Note: This cannot be used together with the text props. */
    renderTooltipContent?: () => ReactNode;

    /** Unique key of renderTooltipContent to rerender the tooltip when one of the key changes */
    renderTooltipContentKey?: string[];

    /** Whether to left align the tooltip relative to wrapped component */
    shouldForceRenderingLeft?: boolean;

    shouldForceRenderingBelow?: boolean;

    /** Additional styles for tooltip wrapper view */
    wrapperStyle?: StyleProp<ViewStyle>;
};

type TooltipRect = {
    x: number;
    y: number;
    width: number;
    height: number;
};

type BaseTooltipState = {
    /** Is tooltip visible */
    isVisible: boolean;

    /** Show tooltip */
    showTooltip: () => void;

    /** Hide tooltip */
    hideTooltip: () => void;

    /** Update the tooltip bounding rectangle */
    updateBounds: (rect: TooltipRect) => void;
};

type BaseTooltipProps = SharedTooltipProps & {
    children: React.FC<BaseTooltipState>;
};

type TooltipProps = ChildrenProps & SharedTooltipProps;

type HoverableTooltipProps = TooltipProps & {
    /** Whether to show the tooltip immediately without hovering over the wrapped component */
    shouldRenderWithoutHover?: false | undefined;

    /** passes this down to Hoverable component to decide whether to handle the scroll behaviour to show hover once the scroll ends */
    shouldHandleScroll?: boolean;
};

type EducationalTooltipProps = TooltipProps & {
    /** Whether to show the tooltip immediately without hovering over the wrapped component */
    shouldRenderWithoutHover: true;
};

type TooltipExtendedProps = (EducationalTooltipProps | HoverableTooltipProps) & {
    /** Whether the actual Tooltip should be rendered. If false, it's just going to return the children */
    shouldRender?: boolean;
};

export default TooltipProps;
export type {HoverableTooltipProps, TooltipRect, BaseTooltipProps, TooltipExtendedProps};
