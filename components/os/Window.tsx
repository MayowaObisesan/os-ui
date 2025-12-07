"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { SHButton } from "@/components/ui/button"
import {OSMenu} from "@/components/os/Menu";
import {Flex, Theme} from "@radix-ui/themes";
import {LucideMaximize2, LucideMinus, LucideX} from "lucide-react";
import {cn} from "@/lib/utils";
import {useState} from "react";

export function OSWindow(
  {
    menu,
    children,
  } : {
    menu: React.ReactNode,
    children: React.ReactNode,
  }
) {
  const [osType, setOsType] = useState<'mac' | 'others'>('mac');

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <SHButton variant="outline">Show Dialog</SHButton>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogFooter className={'p-0! justify-start!'}>
            {/*<AlertDialogAction>Continue</AlertDialogAction>*/}
            <Theme className={'w-full'}>
              <Flex className={cn("w-full!", osType === 'others' ? 'flex-row-reverse' : 'flex-row justify-between')} gap={'2'}>
                <Flex className={cn(osType === 'others' ? 'flex-row-reverse flex-1' : '')} align={'center'} gapX={'2'} pl={'0'}>
                  <AlertDialogCancel className={'p-0 border-0 outline-0 ring-0! bg-transparent!'}>
                    <SHButton className={'size-4 bg-[tomato]! text-black'} size={'icon'}>
                      <LucideX className={'size-2.5'} size={1} strokeWidth={4} />
                    </SHButton>
                  </AlertDialogCancel>
                  <SHButton className={'size-4 bg-amber-400! text-black'} size={'icon'}>
                    <LucideMinus className={'size-2.5'} size={1} strokeWidth={4} />
                  </SHButton>
                  <SHButton className={'size-4 bg-green-500! text-black'} size={'icon'}>
                    <LucideMaximize2 className={'size-2'} size={1} strokeWidth={4} />
                  </SHButton>
                </Flex>
                <OSMenu />
              </Flex>
            </Theme>
          </AlertDialogFooter>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  )
}
