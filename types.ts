
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';

export interface SectionProps {
  id: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export interface Laureate {
  name: string;
  image: string;
  role: string;
  desc: string;
}

export type ToastType = 'xp' | 'unlock' | 'system' | 'error';

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

export type Tier = 'free' | 'premium';
