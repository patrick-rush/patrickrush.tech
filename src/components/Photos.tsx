import { promises as fs } from 'fs'
import path from 'path'
import React from 'react';
import Image from 'next/image'
import clsx from 'clsx'

// const { container, main, title, grid, card } = styles

export const Photos = async () => {
    const imageDirectory = path.join(process.cwd(), '/public/images/');
    const imageFilenames = await fs.readdir(imageDirectory)

    return (
        <Gallery images={imageFilenames} />
    );
};

const Gallery = ({ images }: { images: Array<string>; }) => {
    "use client"
    let rotations = ['rotate-2', '-rotate-2', 'rotate-2', 'rotate-2', '-rotate-2']

    const shuffled = images.sort(() => 0.5 - Math.random());

    let selected = shuffled.slice(0, 5);

    return (
        <div className="mt-16 sm:mt-20">
            <div className="-my-4 flex justify-center gap-5 overflow-hidden py-4 sm:gap-8">
                {selected.map((image, imageIndex: number) => (
                    <div
                        key={imageIndex}
                        className={clsx(
                        'relative aspect-[9/10] w-44 flex-none overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800 sm:w-72 sm:rounded-2xl',
                        rotations[imageIndex % rotations.length],
                        )}
                    >
                    <Image
                        src={`/images/${image}`}
                        alt={image.split(".")[0].split('-').join(' ')}
                        fill
                        sizes="(min-width: 640px) 18rem, 11rem"
                        className="absolute inset-0 h-full w-full object-cover"
                        />
                    </div>   
                ))}
            </div>
        </div>
    )
}