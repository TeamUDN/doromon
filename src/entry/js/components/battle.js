const top = new Vue({
  el: '#battlePage',
  // FlaskとVueを共存させるためにDelimiterを変更する
  delimiters: ["[[", "]]"],
  data: {
    enemy_info: null,
    radius_data1: [],
    radius_data2: [],
    radius_data3: [],
    radius_data4: [],
    enemy_data1: [2, 3, 1],
    enemy_data2: [75, 10, 10],
    enemy_data3: { "attack": 15, "attribute": 1, "defence": 16, "hp": 200, "speed": 22 },
    player: false,
    enemy: false,
    end_flag: false,
    battle_manager_order: 0,
    turn_count: 0,
    cnt: 0,
    attacker: 0,
    defender: 0,
    damage_times: 1.0,
    starthp:0
  },
  mounted() {
    // json取得
    axios
      .get('../../../static/json/enemy.json')
      .then(response => {
        // 取得したデータを配列に格納
        this.enemy_info = response.data.data
        console.log(this.enemy_info)
        console.log(this.enemy_info[0].name)
      })
    // 自作キャラのパラメータ取得
    this.radius_data1 = document.getElementById('p').value
    this.radius_data2 = document.getElementById('r').value
    var getJSON = document.getElementById('s').value
    this.radius_data3 = JSON.parse(getJSON)
    this.radius_data4 = document.getElementById('cs').value
    this.battle_start()
  },
  methods: {
    battle_manager: function () {
      if(this.end_flag == true){
        return
      }
      //バトル開始
      if(this.battle_manager_order == 0){
        console.log("battle start!")
        this.radius_data3["hp"] *= 10
        this.starthp = this.radius_data3["hp"]
      }
      //
      if(this.battle_manager_order == 1){
        this.pre_battle()
      }
      if(this.battle_manager_order == 2){
        this.check_speed()
      }
      if(this.battle_manager_order == 3){
        this.attack(this.player)
      }
      if(this.battle_manager_order == 4){
        this.attack(this.enemy)
      }
      if(this.battle_manager_order == 5){
        this.end_check()
      }
      this.battle_manager_order += 1
      if(this.battle_manager_order == 6){
        this.battle_manager_order = 1
      }
    },
    pre_battle: function () {
      this.turn_count += 1
      console.log("Turn" + this.turn_count)
    },
    check_speed: function () {
      if (this.radius_data3['speed'] >= this.enemy_data3['speed']) {
        this.player = true
        this.enemy = false
        console.log("あなたが先手です")
      } else {
        this.player = false
        this.enemy = true
        console.log("敵が先手です")
      }
      return
    },
    end_check: function () {
      console.log("あなたの体力" + this.radius_data3["hp"])
      console.log("敵の体力" + this.enemy_data3["hp"])
      if (this.radius_data3["hp"] <= 0 || this.enemy_data3["hp"] <= 0) {
        console.log("hp_0")
      }else if (this.turn_count == 10) {
        console.log("turn_over")
      } else { return }
      this.open_result()
    },
    open_result: function () {
      console.log("end")
      if(this.radius_data3["hp"] >= this.enemy_data3["hp"] ){
        console.log("あなたの勝利です")
      }else{
        console.log("あなたの負けです")
      }
      this.end_flag = true
    },
    attack:async function (former) {
      if (former == true) {
        this.attacker = this.radius_data3["attribute"]
        this.defender = this.enemy_data3["attribute"]
        await this.check_attribute()
        var damage = Math.round(this.radius_data3["attack"] * this.damage_times * (1 - (this.enemy_data3["defence"] / 100)))
        this.enemy_data3["hp"] -= damage
        console.log("敵に" + damage + "のダメージ")
      } else {
        this.attacker = this.enemy_data3["attribute"]
        this.defender = this.radius_data3["attribute"]
        await this.check_attribute()
        var damage = Math.round(this.radius_data3["attack"] * this.damage_times * (1 - (this.radius_data3["defence"] / 100)))
        this.radius_data3["hp"] -= damage
        console.log("自分に" + damage + "のダメージ")
      }
    },
    check_attribute:async function () {
      this.damage_times = 1.0
      if (this.attacker == 0 && this.defender == 1) {
        this.damage_times = 1.2
        console.log("地属性に効果抜群だ！")
      } else if (this.attacker == 1 && this.defender == 2) {
        this.damage_times = 1.2
        console.log("海属性に効果抜群だ！")
      } else if (this.attacker == 2 && this.defender == 0) {
        this.damage_times = 1.2
        console.log("天属性に効果抜群だ！")
      }
      //return this.damage_times
    },
    battle_start: function () {
      const update = () => {
        requestAnimationFrame(update)
          if(this.cnt%30 == 0){
          this.battle_manager()
          }
          this.cnt += 1
      }
      update()
    }
  }
});
