/**
 * Created by twi18192 on 22/09/15.
 */

<p>
  {(() => {
    var RedBlockInfo = RedBlock.getRedBlockInfo();
    switch (this.state.redBlockPropertiesClicked) {
      case true: return RedBlockInfo;
      case false: return "nada";
      default: return "default";
    }
  })()}
</p>

<p>
{(() => {
  var BlueBlockInfo = BlueBlock.getBlueBlockInfo();
  switch (this.state.blueBlockPropertiesClicked) {
    case true: return BlueBlockInfo;
    case false: return "nada";
    default: return "default";
  }
})()}
</p>

  <p>
    {(() => {
      var GreenBlockInfo = GreenBlock.getGreenBlockInfo();
      switch (this.state.greenBlockPropertiesClicked) {
        case true: return GreenBlockInfo;
        case false: return "nada";
        default: return "default";
      }
    })()}
  </p>

/* BTW,onClick={this.handleActionChangeSomeInfo} use to be here :P*/
