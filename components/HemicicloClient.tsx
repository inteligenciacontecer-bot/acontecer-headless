'use client';
import dynamic from 'next/dynamic';

const Hemiciclo = dynamic(() => import('@/components/Hemiciclo'), { ssr: false });

export default Hemiciclo;
