
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { Zap, CheckCircle, Crown } from 'lucide-react';
import { BrainIcon } from './components/Shared';

export const XP_PER_LEVEL = 500;

export const RANK_TITLES = [
    "Initiate",
    "Operator",
    "Specialist",
    "Architect",
    "Construct",
    "Omniscient"
];

export const ACHIEVEMENTS = [
    { id: 'first_blood', name: 'First Dive', desc: 'Complete 1 Focus Session', icon: Zap },
    { id: 'task_force', name: 'Task Force', desc: 'Complete 5 Tasks', icon: CheckCircle },
    { id: 'deep_work', name: 'Deep Fried', desc: 'Accumulate 1000 XP', icon: BrainIcon },
    { id: 'obsidian', name: 'Obsidian', desc: 'Upgrade to Premium', icon: Crown },
];
