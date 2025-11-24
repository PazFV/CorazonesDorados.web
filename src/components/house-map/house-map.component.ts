
import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-house-map',
  templateUrl: './house-map.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class HouseMapComponent {
  currentRoom = input<string | null>(null);

  // Mapping from API room names to display names in Spanish
  roomMap: { [key: string]: string } = {
    'Living': 'Sala de Estar',
    'Kitchen': 'Cocina',
    'Bedroom': 'Dormitorio',
    'Bathroom': 'Baño',
    'Hallway': 'Pasillo'
  };

  getRoomDisplayName(apiKey: string): string {
    return this.roomMap[apiKey] || apiKey;
  }
  
  getRoomKeys(): string[] {
    return Object.keys(this.roomMap);
  }
}
