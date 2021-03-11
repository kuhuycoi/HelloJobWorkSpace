import { Meta } from '@angular/platform-browser';

export function initMetaShare(metaService: Meta, url?: string, title?: string, description?: string, image?: string, type = 'website') {
    metaService.addTag({ 'og:url': url });
    metaService.addTag({ 'og:title': title });
    metaService.addTag({ 'og:description': description });
    metaService.addTag({ 'og:image': image });
    metaService.addTag({ 'og:type': type });
}
