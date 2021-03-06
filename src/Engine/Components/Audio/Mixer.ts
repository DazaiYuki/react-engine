
export default class Mixer {
    constructor(options?: MixerOptions) {
        this.ctx = new AudioContext(options?.ctxOptions)
        this.gain = this.ctx.createGain()
        if (options?.dynamicCompressorOptions) {
            this.dynamicCompressor = this.ctx.createDynamicsCompressor()

            options.dynamicCompressorOptions.knee ?
                this.dynamicCompressor.knee
                    .setValueAtTime(options.dynamicCompressorOptions.knee, this.ctx.currentTime) : void


                //TODO:DynamicCompressor Options

                this.dynamicCompressor.connect(this.ctx.destination)
            this.gain.connect(this.dynamicCompressor)
        } else {
            this.dynamicCompressor = undefined
            this.gain.connect(this.ctx.destination)
        }
    }
    ctx: AudioContext
    gain: GainNode
    dynamicCompressor: DynamicsCompressorNode | undefined
    //private _sources: Set<AudioBufferSourceNode> = new Set()
    private _sourcesMap: Map<AudioBuffer, AudioBufferSourceNode|null> = new Map()

    addSource(buf: AudioBuffer) {
        let node = this.ctx.createBufferSource()
        node.buffer = buf
        //this._sources.add(node)
        this._sourcesMap.set(buf, node)
    }
    /**
     * 删除指定的ArrayBuffer对应的AudioBufferSourceNode
     *
     * @author KotoriK
     * @param {AudioBuffer} buf
     * @returns
     * @memberof Mixer
     */
    removeSource(buf: AudioBuffer) {
        let node = this._sourcesMap.get(buf)
        if (node) {
            this._sourcesMap.set(buf,null)//neccessary to GC unused AudioBufferSourceNode
            //return this._sources.delete(node)
            return true
        }else{
            return false
        }
    }
    pauseAll(){

    }
    play(buf:AudioBuffer){
        let node=this._sourcesMap.get(buf)
        if(node){
            node.start(0)
            return true
        }else{
            return false
        }
    }
    stop(buf:AudioBuffer){
        let node=this._sourcesMap.get(buf)
        if(node){
            node.stop(0)
            return true
        }else{
            return false
        }
    }

}
export interface MixerOptions {
    ctxOptions?: AudioContextOptions | undefined
    dynamicCompressorOptions?: DynamicsCompressorOptions | undefined
}