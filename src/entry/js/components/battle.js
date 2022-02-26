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
    enemy_data1: [],
    enemy_data2: [],
    enemy_data3: {},
    player: false,
    enemy: false,
    end_flag: false,
    battle_manager_order: 0,
    turn_count: 0,
    cnt: 0,
    attacker: 0,
    defender: 0,
    damage_times: 1.0,
    starthp: 0,
    enemystarthp: 0,
    enemy_number: 0,
    skill_flag: false,
    img_url: ''
  },
  mounted() {
    // json取得
    axios
      .get('../../../static/json/enemy.json')
      .then(response => {
        // 取得したデータを配列に格納
        this.enemy_info = response.data.data
        this.enemy_number = this.getRandomInt(1, this.enemy_info.length)
        this.img_url = '../static/img/enemy_img/'+this.enemy_info[this.enemy_number].name+'.png'
        console.log(this.enemy_info[this.enemy_number].name)
        this.enemy_data1 = this.enemy_info[this.enemy_number].status.class
        this.enemy_data2 = this.enemy_info[this.enemy_number].status.percentage
        this.enemy_data3 = this.enemy_info[this.enemy_number].status.status
        console.log(this.enemy_data1)
        console.log(this.radius_data1)
        this.battle_start()
      })
    // 自作キャラのパラメータ取得
    this.radius_data2 = document.getElementById('p').value //確率
    this.radius_data1 = document.getElementById('r').value //クラス
    var getJSON = document.getElementById('s').value
    this.radius_data3 = JSON.parse(getJSON)
    this.radius_data4 = document.getElementById('cs').value
  },
  methods: {
    battle_manager: function () {
      if (this.end_flag == true) {
        return
      }
      //バトル開始
      if (this.battle_manager_order == 0) {
        console.log("battle start!")
        this.radius_data3["hp"] *= 10
        this.enemy_data3["hp"] *= 10
        this.starthp = this.radius_data3["hp"]
        this.enemystarthp = this.enemy_data3["hp"]
        console.log("あなたのHP" + this.starthp)
        console.log("敵のHP" + this.enemystarthp)
      }
      //
      if (this.battle_manager_order == 1) {
        this.pre_battle_skill()
      }
      if (this.battle_manager_order == 2) {
        this.pre_battle()
      }
      if (this.battle_manager_order == 3) {
        this.check_speed_skill()
      }
      if (this.battle_manager_order == 4) {
        this.check_speed()
      }
      if (this.battle_manager_order == 5) {
        //this.attack_skill(this.player)
      }
      if (this.battle_manager_order == 6) {
        this.attack(this.player)
      }
      if (this.battle_manager_order == 7) {
        //this.attack_skill(this.enemy)
      }
      if (this.battle_manager_order == 8) {
        this.attack(this.enemy)
      }
      if (this.battle_manager_order == 9) {
        //this.end_check_skill()
      }
      if (this.battle_manager_order == 10) {
        this.end_check()
      }
      this.battle_manager_order += 1
      if (this.battle_manager_order == 11) {
        this.battle_manager_order = 2
      }
    },
    pre_battle: function () {
      this.turn_count += 1
      console.log("Turn" + this.turn_count)
    },
    pre_battle_skill: function () {
      //5のスキルチェック
      if (this.radius_data1.indexOf(5) != -1) {
        console.log("【摸倣学習】発動")
        this.radius_data1.push(this.enemy_data1[0])
        console.log("相手の" + this.enemy_data1[0] + "のスキルをコピーした！")
        this.skill_flag = true
      } if (this.enemy_data1.indexOf(5) != -1) {
        console.log("【摸倣学習】(敵)発動")
        this.enemy_data1.push(this.raidus_data1[0])
        console.log("自分の" + this.enemy_data1[0] + "のスキルをコピーされた！")
        this.skill_flag = true
      }
      if (this.skill_flag == false) {
        this.battle_manager_order += 1
      }else{
        this.skill_flag = false}
    },
    check_speed_skill: function () {
      //6 snowmanのスキルチェック
      if (this.radius_data1.indexOf(6) != -1) {
        console.log("【雪だるま作ろう】発動")
        this.radius_data3['hp'] += Math.round(this.starthp * 0.03)
        console.log("あなたの体力が" + Math.round(this.starthp * 0.03) + "回復した！")
        this.skill_flag = true
      } if (this.enemy_data1.indexOf(6) != -1)
        this.enemy_data3['hp'] += Math.round(this.enemystarthp * 0.03)
      console.log("敵の体力が" + Math.round(this.enemystarthp * 0.03) + "回復した！")
      this.skill_flag = true

      //7 submarine
      if (this.radius_data1.indexOf(7) != -1){
        if(this.turn_count >= 6){
          this.radius_data3['attack'] += 30
          this.radius_data3['defence'] -= 15
          console.log("あなたの攻撃力が30上がり、防御力が15下がった！")
          this.skill_flag = true
        }
      }
      if (this.enemy_data1.indexOf(7) != -1){
        if(this.turn_count >= 6){
          this.enemy_data3['attack'] += 30
          this.enemy_data3['defence'] -= 15
          console.log("敵の攻撃力が30上がり、防御力が15下がった！")
          this.skill_flag = true
        }
      }

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
      } else if (this.turn_count == 10) {
        console.log("turn_over")
      } else { return }
      this.open_result()
    },
    open_result: function () {
      console.log("end")
      if (this.radius_data3["hp"] >= this.enemy_data3["hp"]) {
        console.log("あなたの勝利です")
      } else {
        console.log("あなたの負けです")
      }
      this.end_flag = true
    },
    attack: async function (former) {
      if (former == true) {//自分の攻撃
        this.attacker = this.radius_data3["attribute"]
        this.defender = this.enemy_data3["attribute"]
        await this.check_attribute()
        var damage = Math.round(this.radius_data3["attack"] * this.damage_times * (1 - (this.enemy_data3["defence"] / 100)))
        this.enemy_data3["hp"] -= damage
        console.log("敵に" + damage + "のダメージ")
      } else {//敵の攻撃
        this.attacker = this.enemy_data3["attribute"]
        this.defender = this.radius_data3["attribute"]
        await this.check_attribute()
        var damage = Math.round(this.radius_data3["attack"] * this.damage_times * (1 - (this.radius_data3["defence"] / 100)))
        this.radius_data3["hp"] -= damage
        console.log("自分に" + damage + "のダメージ")
      }
    },
    check_attribute: async function () {
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
    getRandomInt: function (min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    battle_start: function () {
      const update = () => {
        requestAnimationFrame(update)
        if (this.cnt % 30 == 0) {
          this.battle_manager()
        }
        this.cnt += 1
      }
      update()
    }
  }
});
