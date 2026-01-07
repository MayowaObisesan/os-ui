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
      className={'cursor-pointer bg-background/25 backdrop-blur-sm px-3 py-4 rounded-2xl'}
      align={'center'}
      direction={'column'}
      gap={'2'}
      justify={'center'}
      width={'92px'}
      maxWidth={'92px'}
      onClick={onClick} // Forward the onClick prop to Flex
    >
      {/*<Button className={'rounded-xl'} size={'icon-lg'} variant={'default'}>*/}
      {/*</Button>*/}
      <Flex align={'center'} className={'size-10'} justify={'center'}>{icon}</Flex>
      <Text align={'center'} className={'line-clamp-3'} size={'2'} trim={'normal'} weight={'medium'}>
        {name}
      </Text>
    </Flex>
  )
}
