
import { IconProps } from '@radix-ui/react-icons/dist/types';
import ListFilterIcon from './ListFilter';
import FilterIcon from './Filter';

interface IIconProps extends IconProps {
  type:
    | 'list_filter'
    | 'filter'
    | string;
}

export default function Icon({ type, color, height, width, fill, ...rest }: IIconProps) {
  const iconProps = {
    color,
    height: Number(height), 
    width: Number(width),
    fill,
    ...rest,
  };

  return (
    <>
      {
        {
          list_filter: <ListFilterIcon {...iconProps} />,
          filter: <FilterIcon {...iconProps} />,
        }[type]
      }
    </>
  );
}