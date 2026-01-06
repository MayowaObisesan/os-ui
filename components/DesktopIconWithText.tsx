"use client";

import {Button} from "@/components/ui/button";
import {Flex, Text} from "@radix-ui/themes";
import React, {MouseEventHandler, ReactNode} from "react";

interface DesktopIconWithTextProps {
  icon: ReactNode;
  name: string;
  onClick?: MouseEventHandler<HTMLDivElement>; // Add optional onClick prop
}

export function DesktopIconWithText({ icon, name, onClick }: DesktopIconWithTextProps) {
  return (
    <Flex
      className={'cursor-pointer'}
      align={'center'}
      direction={'column'}
      gap={'1'}
      justify={'center'}
      width={'60px'}
      maxWidth={'80px'}
      onClick={onClick} // Forward the onClick prop to Flex
    >
      <Button className={'rounded-2xl'} size={'icon'} variant={'outline'}>
        {icon}
      </Button>
      <Text align={'center'} className={'line-clamp-3'} size={'1'} trim={'normal'}>
        {name}
      </Text>
    </Flex>
  )
}
