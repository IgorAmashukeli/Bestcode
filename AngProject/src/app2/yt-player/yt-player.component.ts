import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import { YouTubePlayer } from '@angular/youtube-player';

@Component({
  selector: 'yt-player',
  standalone: true,
  imports: [YouTubePlayer],
  templateUrl: './yt-player.component.html',
  styleUrl: './yt-player.component.css',
})
export class YtPlayerComponent implements AfterViewInit {
  @ViewChild('youTubePlayer') youTubePlayer!: ElementRef<HTMLDivElement>;

  videoHeight: number | undefined;
  videoWidth: number | undefined;

  @Input('videoId') videoId!: string;

  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    this.onResize();
    window.addEventListener('resize', this.onResize.bind(this));
  }

  onResize(): void {
    this.videoWidth = this.youTubePlayer.nativeElement.clientWidth;
    this.videoHeight = this.videoWidth * 0.6;
    this.changeDetectorRef.detectChanges();
  }
}
