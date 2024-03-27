
import { IconProps } from '@radix-ui/react-icons/dist/types';
import ListFilterIcon from './ListFilter';
import FilterIcon from './Filter';
import PlayIcon from './Play';
import CheckIcon from './Check';
import TrashIcon from './Trash';
import PencilIcon from './Pencil';

interface IIconProps extends IconProps {
  type:
    | 'list_filter'
    | 'filter'
    | 'play'
    | 'check'
    | 'trash'
    | 'pencil'
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
          play: <PlayIcon {...iconProps} />,
          check: <CheckIcon {...iconProps} />,
          trash: <TrashIcon {...iconProps} />,
          pencil: <PencilIcon {...iconProps} />,
        }[type]
      }
    </>
  );
}