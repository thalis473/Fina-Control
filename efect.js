/*Modal*/
const Caixa={
   Open(){
      document
      .querySelector('.modal-overlay') /*pegando o elemento com a class modal-overlay*/
      .classList /*listando todas as classe da requisição acima*/
      .add('active')/*adicionando uma class active*/
   },

  Close(){document.querySelector('.modal-overlay').classList.remove('active')},
   
}
  
//armazenando os dados
const Storage={
   get(){
     return JSON.parse(localStorage.getItem('control.fina:transactions'))||[]
   },
   set(transactions){
      localStorage.setItem("control.fina:transactions",JSON.stringify(transactions))
   }
}

//manipulação  dos dados
const Transaction={
   all:Storage.get(),

   add(transaction){
      Transaction.all.push(transaction)
      App.reload()
   },
   remove(index){
      Transaction.all.splice(index,1)
      App.reload()
   },

   incomes(){
      let income =0;
      //pegar todas as transações
      //para cada transação

      Transaction.all.forEach(transaction=>{
         //se ela form maior que zero
         if(transaction.amount >0){
            //somar a uma variavel e retornar a variavel
            income = income + transaction.amount;
         }
      })
      return income;
   },

   expenses(){
      let expense =0;
      Transaction.all.forEach(transaction=>{
         if(transaction.amount < 0){
            expense += transaction.amount;
         }
      })
      return expense;
   },

   total(){
      return Transaction.incomes()+Transaction.expenses();
   }

}

// Substituir os dados do HTML com os dados do js 
const DOM = {
   transactionsContainer:document.querySelector('#data-table tbody'),

   addTransaction(transaction,index){
      //console.log(transaction)//test para o objeto estiver ok
      const tr = document.createElement('tr') //crianto o tr 
      tr.innerHTML= DOM.innerHTMLTransaction(transaction,index)
      tr.dataset.index=index
      DOM.transactionsContainer.appendChild(tr) //lançando no html
      
   },

   innerHTMLTransaction(transaction, index){
      //ternario para trocar a class do td referente ao valor 
      const CSSClass= transaction.amount > 0 ? "entrance" : "exit"
      const amount= Utils.formatCurrency(transaction.amount)
      const html=
      `
         <td class="description">${transaction.description}</td>
         <td class="${CSSClass}">R$${amount}</td>
         <td class="date">${transaction.date}</td>
         <td>
            <img onclick="Transaction.remove(${index})" src="./assests/minus.svg" alt="Remover transação">
         </td>
        
      `
      return html
   },
   updateBalance(){
      document
      .getElementById('income')
      .innerHTML=Utils.formatCurrency(Transaction.incomes())
      document
      .getElementById('expense')
      .innerHTML=Utils.formatCurrency(Transaction.expenses())
      document
      .getElementById('totalDisplay')
      .innerHTML=Utils.formatCurrency(Transaction.total())
   },

   clearTransacrions(){
      DOM.transactionsContainer.innerHTML=""
   }


}

//formatação dos valores
const Utils ={
   formatAmount(value){
      value= Number(value)*100
      return value
   },
   formatDate(date){
      const splittedate = date.split("-") //retirei o traço
      return `${splittedate[2]}/${splittedate[1]}/${splittedate[0]}`
   },
   formatCurrency(value){
      const signal = Number(value) < 0 ? " -" : " " //colocando sinal de negativo ou positivo

    value = String(value).replace(/\D/g, ""); // transformei em string

    value= Number(value) / 100;
    
    value= value.toLocaleString("pt-BR",{
       currency: "BRL",
       sytle: "currency",
       
    });
       
      return signal + value
   },
   
}

//sistema do formulario
const  Form ={
   //pegando os dados
   description: document.querySelector('input#descripition'),
   amount: document.querySelector('input#amount'),
   date: document.querySelector('input#date'),

   getValues(){
      return{
         description:Form.description.value,
         amount:Form.amount.value,
         date:Form.date.value,
      }
   },

   validate(){
      const { description,amount,date} =Form.getValues();
      if( 
         description.trim()=== "" ||
         amount.trim() ==="" ||
         date.trim() ===""){
            throw new Error ("Por favor preencha todos os campos")
         }
         
         
   },
   formatData(){
      let { description,amount,date} =Form.getValues()
      amount =Utils.formatAmount(amount)

      date =Utils.formatDate(date)

      return {
         description,
         amount,
         date
      }
   },
   saveTransaction(transaction){
      Transaction.add(transaction)
   },

   clearDate(){
      Form.description.value="",
      Form.amount.value="",
      Form.date.value=""
   },

   submit(event){
      event.preventDefault()

      try{
      //verificação se tudo foi preenchido
      Form.validate()
      //formatação dos dados
      const transaction = Form.formatData()
      // salvar
      Form.saveTransaction(transaction)
      //apagar os dados do formulario
      Form.clearDate()
      //modal feche
         Caixa.Close()
     

      }catch(error){
        alert(error.message)
      }
      
     
   }
}

//chamando as funções
const App={
   init(){

      //populou 2

      Transaction.all.forEach((transaction,index)=>{
         DOM.addTransaction(transaction,index)
      })

      DOM.updateBalance()

      Storage.set(Transaction.all)
   },
     // atualizou 4
   reload(){
      DOM.clearTransacrions()
      App.init()
   },
}

//iniciou 1
App.init()








