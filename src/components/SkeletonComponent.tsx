/* eslint-disable @typescript-eslint/no-explicit-any */
import { Skeleton, SkeletonProps } from "antd"
import { SkeletonButtonProps } from "antd/es/skeleton/Button";
import { SkeletonImageProps } from "antd/es/skeleton/Image";
import { SkeletonInputProps } from "antd/es/skeleton/Input";
import { SkeletonNodeProps } from "antd/es/skeleton/Node";
import { SkeletonParagraphProps } from "antd/es/skeleton/Paragraph";

interface SkeletonCompProps extends SkeletonProps , SkeletonButtonProps , SkeletonImageProps , SkeletonInputProps, SkeletonParagraphProps , SkeletonNodeProps , SkeletonParagraphProps  {
  [key: string]: any;
  type?: 'button' | 'image' | 'input' | 'avatar' | 'Node' | undefined;
}
const SkeletonComponent = ({type,...reset}:SkeletonCompProps) => {
  return (
    <>
    {type == 'button' &&<Skeleton.Button {...reset} />}
    {type == 'avatar' &&<Skeleton.Avatar shape={'circle'} active />}
    {type == 'image' &&<Skeleton.Image {...reset} />}
    {type == 'input' &&<Skeleton.Input {...reset} />}
    {type == 'Node' &&<Skeleton.Node {...reset} />}
    {!type &&<Skeleton {...reset} />}
    
    </>
  )
}

export default SkeletonComponent