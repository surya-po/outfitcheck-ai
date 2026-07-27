const fs = require('fs');
let content = fs.readFileSync('src/components/profile/EditableProfileForm.tsx', 'utf8');

// Replace left column card background
content = content.replace('bg-white border border-[#FDF2F8]', 'bg-card border border-border/60');
content = content.replace('bg-gray-100 border-4 border-[#FDF2F8]', 'border-4 border-background bg-muted');

// Replace text colors in left column
content = content.replace('text-gray-900 truncate', 'text-foreground truncate');
content = content.replace(/text-gray-500 truncate/g, 'text-muted-foreground truncate');
content = content.replace('border-gray-100 text-sm text-gray-500', 'border-border/60 text-sm text-muted-foreground');
content = content.replace('text-gray-900 font-semibold', 'text-foreground font-semibold');

// Avatar edit section
content = content.replace('text-gray-500 mb-2', 'text-muted-foreground mb-2');
content = content.replace('bg-[#FDF2F8] file:text-[#EC4899] hover:file:bg-[#FCE7F3]', 'bg-primary/10 file:text-primary hover:file:bg-primary/20');

// Right column - Personal Info card
content = content.replace('bg-white border border-[#FDF2F8]', 'bg-card border border-border/60');
content = content.replace('text-gray-900 mb-6 flex', 'text-foreground mb-6 flex');
content = content.replace('text-[#EC4899]" /> Informasi Personal', 'text-primary" /> Informasi Personal');

// Right column - labels & values
content = content.replace(/text-gray-500 font-medium/g, 'text-muted-foreground font-medium');
content = content.replace(/text-gray-900\}</g, 'text-foreground}<');
content = content.replace(/text-gray-500">cm/g, 'text-muted-foreground">cm');
content = content.replace(/text-gray-500">kg/g, 'text-muted-foreground">kg');

// Right column - AI Snapshot
content = content.replace('bg-gradient-to-br from-[#1E1E2D] to-gray-900', 'bg-primary/10 border border-primary/20');
content = content.replace('bg-[#EC4899]/10 rounded-full', 'bg-primary/20 rounded-full');
content = content.replace('text-white font-bold text-lg', 'text-primary font-bold text-lg');
content = content.replace('text-[#EC4899]" /> Ringkasan', 'text-primary" /> Ringkasan');

content = content.replace(/bg-black\/20 border border-white\/5/g, 'bg-background/50 backdrop-blur-sm border border-primary/20');
content = content.replace(/text-\[#EC4899\] font-bold block/g, 'text-primary/80 font-bold block');
content = content.replace(/text-white font-bold text-lg/g, 'text-foreground font-bold text-lg');
content = content.replace(/text-white font-bold text-sm/g, 'text-foreground font-bold text-sm');
content = content.replace('text-white/60 text-sm py-4', 'text-primary/70 text-sm py-4');

fs.writeFileSync('src/components/profile/EditableProfileForm.tsx', content);
console.log('Replacement done.');
