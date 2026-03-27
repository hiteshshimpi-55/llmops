import { keyframes, style } from '@vanilla-extract/css';
import { colors, spacing, sprinkles } from '@ui';

const fadeIn = keyframes({
  from: { opacity: 0, transform: 'translateY(-4px)' },
  to: { opacity: 1, transform: 'translateY(0)' },
});

export const triggerLabel = style({
  fontWeight: 600,
});

export const trigger = style([
  sprinkles({
    fontSize: 'xs',
    fontFamily: 'mono',
    borderRadius: 'xs',
  }),
  {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: `0 ${spacing.sm}`,
    backgroundColor: colors.gray2,
    border: `1px solid ${colors.gray6}`,
    color: colors.gray11,
    cursor: 'pointer',
    height: '28px',
    outline: 'none',
    transition: 'all 0.15s ease',
    ':hover': {
      backgroundColor: colors.gray3,
      borderColor: colors.gray7,
    },
    ':focus': {
      borderColor: colors.accent9,
    },
  },
]);

export const icon = style({
  display: 'inline-flex',
  opacity: 0.7,
});

export const positioner = style({
  zIndex: 1000,
});

export const popup = style({
  minWidth: '200px',
  maxHeight: '300px',
  overflowY: 'auto',
  backgroundColor: colors.gray1,
  border: `1px solid ${colors.gray4}`,
  borderRadius: spacing.xs,
  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
  animation: `${fadeIn} 150ms ease-out`,
  outline: 'none',
  padding: `${spacing.xs} 0`,
});

export const option = style([
  sprinkles({
    fontSize: 'xs',
    fontFamily: 'mono',
    color: 'gray11',
  }),
  {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    paddingLeft: spacing.xl,
    paddingRight: spacing.sm,
    paddingTop: spacing.xs,
    paddingBottom: spacing.xs,
    cursor: 'pointer',
    outline: 'none',
    transition: 'background-color 0.1s ease',
    ':hover': {
      backgroundColor: colors.gray3,
    },
    selectors: {
      '&[data-highlighted]': {
        backgroundColor: colors.gray3,
      },
      '&[data-selected]': {
        backgroundColor: colors.accent3,
        color: colors.accent11,
      },
    },
  },
]);

export const itemIndicator = style({
  position: 'absolute',
  left: spacing.sm,
  color: colors.accent9,
  display: 'inline-flex',
  alignItems: 'center',
});
