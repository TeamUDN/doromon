const top = new Vue({
  el: '#battlePage',
  // FlaskとVueを共存させるためにDelimiterを変更する
  delimiters: ["[[", "]]"],
  data: {
    enemy_info: null,
    radius_data1: [5, 3, 1],
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
    img_url: '',
    log_message: '',
    user_hp: '',
    enemy_hp: '',
    radius_revived_flag:false,
    enemy_revived_flag:false
  },
  mounted() {
    // json取得
    axios
      .get('../../../static/json/enemy.json')
      .then(response => {
        // 取得したデータを配列に格納
        this.enemy_info = response.data.data
        this.enemy_number = this.getRandomInt(1, this.enemy_info.length)
        this.img_url = '../static/img/enemy_img/' + this.enemy_info[this.enemy_number].name + '.png'
        console.log(this.enemy_info[this.enemy_number].name)
        this.enemy_data1 = this.enemy_info[this.enemy_number].status.class
        this.enemy_data2 = this.enemy_info[this.enemy_number].status.percentage
        this.enemy_data3 = this.enemy_info[this.enemy_number].status.status
        console.log(this.enemy_data1)
        console.log(this.radius_data1)
        this.battle_start()
        this.radius_data1 = this.radius_data1.replace('[', '');
        this.radius_data1 = this.radius_data1.replace(']', '');
        this.radius_data1 = this.radius_data1.replace(/\s+/g, "");
        this.radius_data1 = this.radius_data1.split(',');
        for (let step = 0; step < this.radius_data1.length; step++) {
          this.radius_data1[step] = Number(this.radius_data1[step])
        }
        console.log(this.radius_data1)
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
        this.log_message = 'バトル開始！'
        this.radius_data3["hp"] *= 10
        this.enemy_data3["hp"] *= 10
        this.starthp = this.radius_data3["hp"]
        this.enemystarthp = this.enemy_data3["hp"]
        console.log("あなたのHP" + this.starthp)
        this.user_hp = this.starthp
        console.log("敵のHP" + this.enemystarthp)
        this.enemy_hp = this.enemystarthp
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
        this.attack_skill(this.player)
      }
      if (this.battle_manager_order == 6) {
        this.attack(this.player)
      }
      if (this.battle_manager_order == 7) {
        this.attack_skill(this.enemy)
      }
      if (this.battle_manager_order == 8) {
        this.attack(this.enemy)
      }
      if (this.battle_manager_order == 9) {
        this.end_check_skill()
      }
      if (this.battle_manager_order == 10) {
        this.end_check()
      }
      this.battle_manager_order += 1
      if (this.battle_manager_order >= 11) {
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
        this.log_message = "相手の" + this.enemy_data1[0] + "のスキルをコピーした！"
        console.log(this.radius_data1)
        this.skill_flag = true
      } if (this.enemy_data1.indexOf(5) != -1) {
        console.log("【摸倣学習】(敵)発動")
        this.enemy_data1.push(this.raidus_data1[0])
        console.log("自分の" + this.enemy_data1[0] + "のスキルをコピーされた！")
        this.log_message = "自分の" + this.enemy_data1[0] + "のスキルをコピーされた！"
        this.skill_flag = true
      }
      if (this.skill_flag == false) {
        this.battle_manager_order += 1
      } else {
        this.skill_flag = false
      }
    },
    check_speed_skill: function () {
      //6 snowmanのスキルチェック
      if (this.radius_data1.indexOf(6) != -1) {
        console.log("【雪だるま作ろう】発動")
        this.radius_data3['hp'] += Math.round(this.starthp * 0.03)
        this.user_hp = this.radius_data3["hp"]
        console.log("あなたの体力が" + Math.round(this.starthp * 0.03) + "回復した！")
        this.log_message = "【雪だるま作ろう】発動　あなたの体力が" + Math.round(this.starthp * 0.03) + "回復した！"
        this.skill_flag = true
      } if (this.enemy_data1.indexOf(6) != -1) {
        console.log("【雪だるま作ろう】(敵)発動")
        this.enemy_data3['hp'] += Math.round(this.enemystarthp * 0.03)
        this.enemy_hp = this.enemy_data3["hp"]
        console.log("敵の体力が" + Math.round(this.enemystarthp * 0.03) + "回復した！")
        this.log_message = "【雪だるま作ろう】発動　敵の体力が" + Math.round(this.enemystarthp * 0.03) + "回復した！"
        this.skill_flag = true
      }
      //7 submarine
      if (this.radius_data1.indexOf(7) != -1) {
        console.log("【浮上】発動")
        if (this.turn_count >= 6) {
          this.radius_data3['attack'] += 30
          this.radius_data3['defence'] -= 15
          console.log("あなたの攻撃力が30上がり、防御力が15下がった！")
          this.log_message = 'あなたの攻撃力が30上がり、防御力が15下がった！'
          this.skill_flag = true
        }
      }
      if (this.enemy_data1.indexOf(7) != -1) {
        console.log("【浮上】発動")
        if (this.turn_count >= 6) {
          this.enemy_data3['attack'] += 30
          this.enemy_data3['defence'] -= 15
          console.log("敵の攻撃力が30上がり、防御力が15下がった！")
          this.log_message = '敵の攻撃力が30上がり、防御力が15下がった！'
          this.skill_flag = true
        }
      }

      //9 エッフェル塔
      if (this.radius_data1.indexOf(9) != -1) {
        console.log("【動かざる巨塔】発動")
        if ((this.radius_data3['hp'] / this.starthp) <= 0.05) {
          this.radius_data3['attack'] *= 3
          this.radius_data3['defence'] *= 3
          this.radius_data3['speed'] *= 3
          console.log("あなたのステータスが3倍になった")
          this.skill_flag = true
        }
      }
      if (this.enemy_data1.indexOf(9) != -1) {
        console.log("【動かざる巨塔】(敵)発動")
        if ((this.enemy_data3['hp'] / this.enemystarthp) <= 0.05) {
          this.enemy_data3['attack'] *= 3
          this.enemy_data3['defence'] *= 3
          this.enemy_data3['speed'] *= 3
          console.log("敵のステータスが3倍になった")
          this.skill_flag = true
        }
      }

      //15 シマウマ
      if (this.radius_data1.indexOf(15) != -1) {
        console.log("【生存本能】発動")
        this.radius_data3['speed'] += 10
        console.log("あなたの素早さが10上がった")
        this.skill_flag = true
      }
      if (this.enemy_data1.indexOf(15) != -1) {
        console.log("【生存本能】(敵)発動")
        this.enemy_data3['speed'] += 10
        console.log("敵の素早さが10上がった")
        this.skill_flag = true
      }

      //8 テディベア
      if (this.radius_data1.indexOf(8) != -1) {
        console.log("【闘争心】発動")
        this.radius_data3['attack'] += 10
        console.log("あなたの攻撃が10上がった")
        this.skill_flag = true
      }
      if (this.enemy_data1.indexOf(8) != -1) {
        console.log("【闘争心】(敵)発動")
        this.enemy_data3['attack'] += 10
        console.log("敵の攻撃が10上がった")
        this.skill_flag = true
      }

      if (this.skill_flag == false) {
        this.battle_manager_order += 1
      } else {
        this.skill_flag = false
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
      this.user_hp = this.radius_data3["hp"]
      console.log("敵の体力" + this.enemy_data3["hp"])
      this.enemy_hp = this.enemy_data3["hp"]
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
        this.log_message = 'あなたの勝利です！'
      } else {
        console.log("あなたの負けです")
        this.log_message = 'あなたの負けです…'
      }
      this.end_flag = true
    },
    attack_skill: function (former) {
      this.damage_times = 1.0
      if (former == true) {
        //0 飛行機
        if (this.radius_data1.indexOf(0) != -1) {
          if (this.enemy_data3["attribute"] == 2) {
            console.log("【Take off!!】発動")
            this.damage_times *= 1.5
            console.log("海属性に攻撃時、ダメージが1.5倍!")
            this.skill_flag = true
          }
        }
        //4 鮫
        if (this.radius_data1.indexOf(4) != -1) {
          if (this.enemy_data3["attribute"] == 1) {
            console.log("【サメマゲドン】発動")
            this.damage_times *= 1.5
            console.log("地属性に攻撃時、ダメージが1.5倍!")
            this.skill_flag = true
          }
        }
        //13 傘
        if (this.radius_data1.indexOf(13) != -1) {
          if (this.enemy_data3["attribute"] == 0) {
            console.log("【パラソル】発動")
            this.damage_times *= 1.5
            console.log("天属性に攻撃時、ダメージが1.5倍!")
            this.skill_flag = true
          }
        }

        //11 虎
        if (this.radius_data1.indexOf(11) != -1) {
          if (this.radius_data3['speed'] >= this.enemy_data3['speed']) {
            console.log("【気を見て敏】発動")
            this.damage_times *= 1.5
            console.log("あなたの先制攻撃、ダメージが1.5倍!")
            this.skill_flag = true
          }
        }

      } else {
        if (this.enemy_data1.indexOf(0) != -1) {
          if (this.radius_data3["attribute"] == 2) {
            console.log("【Take off!!】(敵)発動")
            this.damage_times *= 1.5
            console.log("海属性に攻撃時、ダメージが1.5倍!")
            this.skill_flag = true
          }
        }
        if (this.enemy_data1.indexOf(4) != -1) {
          if (this.radius_data3["attribute"] == 1) {
            console.log("【サメマゲドン】(敵)発動")
            this.damage_times *= 1.5
            console.log("地属性に攻撃時、ダメージが1.5倍!")
            this.skill_flag = true
          }
        }
        if (this.enemy_data1.indexOf(13) != -1) {
          if (this.radius_data3["attribute"] == 0) {
            console.log("【パラソル】(敵)発動")
            this.damage_times *= 1.5
            console.log("天属性に攻撃時、ダメージが1.5倍!")
            this.skill_flag = true
          }
        }
        if (this.enemy_data1.indexOf(11) != -1) {
          if (this.radius_data3['speed'] <= this.enemy_data3['speed']) {
            console.log("【気を見て敏】(敵)発動")
            this.damage_times *= 1.5
            console.log("敵の先制攻撃、ダメージが1.5倍!")
            this.skill_flag = true
          }
        }
      }

      //スキル使用したかどうか
      if (this.skill_flag == false) {
        this.battle_manager_order += 1
      } else {
        this.skill_flag = false
      }
    },
    damage_skill: function (damage, former) {
      if (former == true) {//敵がダメージを食らうとき

        //12 竜巻
        if (this.enemy_data1.indexOf(12) != -1) {
          if (this.getRandomInt(1, 100) <= 20) {
            console.log("【乱気流】(敵)発動")
            damage = 0
            console.log("敵は竜巻の力で攻撃を回避した！")
            this.skill_flag = true
          }
        }

        //10 モナ・リザ
        if (this.enemy_data1.indexOf(10) != -1) {
          if (this.getRandomInt(1, 100) <= 20) {
            console.log("【眼力解放】(敵)発動")
            console.log("敵はモナ・リザの真の力で攻撃を反射した！")
            this.radius_data3["hp"] -= damage
            damage = 0
            console.log("あなたに" + damage + "のダメージ")
            this.skill_flag = true
          }
        }

        //2 犬
        if (this.enemy_data1.indexOf(2) != -1) {
          if (damage > 0) {
            console.log("【番犬ガウガウ】(敵)発動")
            this.enemy_data3['attack'] *= 1.1
            console.log("敵の攻撃が1.1倍になった！")
            this.skill_flag = true
          }
        }

      } else {//自分がダメージを食らうとき

        //12 竜巻
        if (this.radius_data1.indexOf(12) != -1) {
          if (this.getRandomInt(1, 100) <= 20) {
            console.log("【乱気流】発動")
            damage = 0
            console.log("あなたは竜巻の力で攻撃を回避した！")
            this.skill_flag = true
          }
        }

        //10モナ・リザ
        if (this.radius_data1.indexOf(10) != -1) {
          if (this.getRandomInt(1, 100) <= 10) {
            console.log("【眼力解放】発動")
            console.log("あなたはモナ・リザの真の力で攻撃を反射した！")
            this.enemy_data3["hp"] -= damage
            damage = 0
            console.log("敵に" + damage + "のダメージ")
            this.skill_flag = true
          }
        }

        if (this.radius_data1.indexOf(2) != -1) {
          if (damage > 0) {
            console.log("【番犬ガウガウ】発動")
            this.radius_data3['attack'] *= 1.1
            console.log("敵の攻撃が1.1倍になった！")
            this.skill_flag = true
          }
        }
      }

      //スキル使用したかどうか
      if (this.skill_flag == false) {
        //this.battle_manager_order += 1
      } else {
        this.skill_flag = false
      }

      return damage
    },
    attack: async function (former) {
      if (former == true) {//自分の攻撃
        this.attacker = this.radius_data3["attribute"]
        this.defender = this.enemy_data3["attribute"]
        await this.check_attribute()
        var damage = Math.round(this.radius_data3["attack"] * this.damage_times * (1 - (this.enemy_data3["defence"] / 100)))
        this.damage_skill(damage, former)
        this.enemy_data3["hp"] -= damage
        console.log("敵に" + damage + "のダメージ")
        this.log_message = "敵に" + damage + "のダメージ！"
      } else {//敵の攻撃
        this.attacker = this.enemy_data3["attribute"]
        this.defender = this.radius_data3["attribute"]
        await this.check_attribute()
        var damage = Math.round(this.radius_data3["attack"] * this.damage_times * (1 - (this.radius_data3["defence"] / 100)))
        this.radius_data3["hp"] -= damage
        console.log("自分に" + damage + "のダメージ")
        this.log_message = "自分に" + damage + "のダメージ！"
      }
    },
    check_attribute: async function () {
      if (this.attacker == 0 && this.defender == 1) {
        this.damage_times *= 1.2
        console.log("地属性に効果抜群だ！")
        this.log_message = "地属性に効果抜群だ！"
      } else if (this.attacker == 1 && this.defender == 2) {
        this.damage_times *= 1.2
        console.log("海属性に効果抜群だ！")
        this.log_message = "海属性に効果抜群だ！"
      } else if (this.attacker == 2 && this.defender == 0) {
        this.damage_times *= 1.2
        console.log("天属性に効果抜群だ！")
        this.log_message = "天属性に効果抜群だ！"
      }
      //return this.damage_times
    },
    end_check_skill: function () {

      //12 イルカ
      if (this.radius_data1.indexOf(3) != -1) {
        if (turn_count % 2 == 0) {
          console.log("【群れアタック】発動")
          var damage = Math.round(this.radius_data3["speed"] * 0.5)
          this.enemy_data3["hp"] -= damage
          console.log("敵に" + damage + "のダメージ！")
          this.skill_flag = true
        }
      }

      if (this.enemy_data1.indexOf(3) != -1) {
        if (turn_count % 2 == 0) {
          console.log("【群れアタック】(敵)発動")
          var damage = Math.round(this.enemy_data3["speed"] * 0.5)
          this.radius_data3["hp"] -= damage
          console.log("あなたに" + damage + "のダメージ！")
          this.skill_flag = true
        }
      }

      //14 洗濯機
      if (this.radius_data1.indexOf(14) != -1) {
        console.log("【漂白剤】発動")
        this.enemy_data3["attack"] -= 5
        console.log("敵の攻撃が5下がった！")
        this.skill_flag = true
      }
      if (this.enemy_data1.indexOf(14) != -1) {
        console.log("【漂白剤】(敵)発動")
        this.radius_data3["attack"] -= 5
        console.log("あなたの攻撃が5下がった！")
        this.skill_flag = true
      }

      //1 天使
      if (this.radius_data1.indexOf(1) != -1) {
        if (this.radius_data3["hp"] <= 0 && this.radius_revived_flag == false) {
          console.log("【天国の使者】発動")
          this.radius_data3["hp"] = this.starthp * 0.5
          console.log("あなたは天国から蘇った！")
          this.skill_flag = true
          this.radius_revived_flag == true
        }
      }
      if (this.enemy_data1.indexOf(1) != -1) {
        if (this.enemy_data3["hp"] <= 0 && this.enemy_revived_flag == false) {
          console.log("【地獄の使者】(敵)発動")
          this.enemy_data3["hp"] = this.enemystarthp * 0.5
          console.log("敵は地獄から蘇った！")
          this.skill_flag = true
          this.enemy_revived_flag == true
        }
      }

      //スキル使用したかどうか
      if (this.skill_flag == false) {
        this.battle_manager_order += 1
      } else {
        this.skill_flag = false
      }
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
