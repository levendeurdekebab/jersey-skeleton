$(document).ready(function() {


	/****************************************
	 **** CHARGEMENT AVANT TOUT LE RESTE ****
	 ****************************************/

	// On affiche la page d'accueil par défaut
	var activeMenu = $("#home_bar");
	var activeElement = $("#home_pane");
	activeMenu.addClass("active")
	activeElement.show();

	function onClickMenu(menuElement) {
		// récupérer l'élément panel attaché à l'élément du menu

		var newElement = $("#" + $(menuElement).attr("for"));
		activeElement.hide();
		newElement.show();

		activeMenu.removeClass("active");
		$(menuElement).addClass("active");

		activeElement = newElement;
		activeMenu = $(menuElement);
	}





	/*****************************
	 **** REQUETES AJAX USERS ****
	 *****************************/



	var isConnected;

	/*
	 * When the user connect or disconnect
	 */
	function setConnected(connected) {
		isConnected = connected;

		if(isConnected) {
			$("#login_navbar").hide();
			$("#info_profil_navbar").show();

			onClickMenu("#home_bar");
		} else {
			$("#info_profil_navbar").hide();
			$("#login_navbar").show();
		}
	}


	function registerUser(name, password, email) {
		$.ajax({
			type : 'POST',
			contentType : 'application/json',
			url : "v1/users/register",
			dataType : "json",
			data : JSON.stringify({
				"id" : 0,
				"name" : name,
				"password" : password, 
				"email" : email
			}),
			success : function(data, textStatus, jqXHR) {
				console.log(data);
				if(data.success) {
					loginUser(name, password);
				}
			},
			error : function(jqXHR, textStatus, errorThrown) {
				alert('postUser error: ' + textStatus);
			}
		});
	}


	function loginUser(name, password) {
		$.ajax({
			type : 'POST',
			contentType : 'application/json',
			url : "v1/users/login",
			dataType : "json",
			data : JSON.stringify({
				"id" : 0,
				"name" : name,
				"password" : password, 
				"email" : ""
			}),
			success : function(data, textStatus, jqXHR) {
				console.log(data);
				if(data.success) {
					// data.message contain uniq id for session
					document.cookie = data.message;
					setConnected(true);
				} else {
					$('#button_login').popover({trigger : 'manual', title: "Erreur", content : data.message, placement : 'bottom'});
					$('#button_login').popover('show');
					
					$('#button_login').on('shown.bs.popover', function() {
					    setTimeout(function() {
					        $('#button_login').popover('hide');
					    }, 5000);
					});
				}
			},
			error : function(jqXHR, textStatus, errorThrown) {
				alert('postUser error: ' + textStatus);
			}
		});
	}

	function logoutUser() {
		$.getJSON("v1/users/logout/" + document.cookie, function(data) {
			console.log(data):
			setConnected(false);
		});
	}




	/******************************
	 **** REQUETES AJAX LEVELS ****
	 ******************************/

	// charge le niveau d'id "levelId" et renvoie le niveau
	function loadLevel(levelId) {
		$.getJSON("v1/levels/" + levelId, function(data) {
			// TODO : Load level into canevas and html here
			console.log(data);
		});
	}




	/****************************
	 **** CONTROLE DES PAGES ****
	 ****************************/


	// affichage de la page lors d'un clique
	$(".menu_bar_element").click(function() {
		onClickMenu(this);
	});

	$("#reg_button").click(function() {
		var newElement = $("#" + $(this).attr("for"));
		activeElement.hide();
		newElement.show();

		activeMenu.removeClass("active");
		//$(this).addClass("active");

		activeElement = newElement;
		activeMenu = $(this);

	});


	// ouverture d'un niveau lors d'un clique sur le niveau dans la liste
	$(".level_preview").click(function() {
		// Chargement du niveau en AJAX
		var idLevel = $(this).attr("id");
		loadLevel(idLevel);		

		// Affichage du panel du niveau
		newElement = $("#game_pane");
		activeElement.hide();
		newElement.show();
		activeElement = newElement;
	});


	// Enregistrer un utilisateur
	$("#button_register").click(function() {
		var name = $("#name_register").val();
		var passwd = $("#password_register").val();
		var email = $("#email_register").val();

		registerUser(name, passwd, email);

		$("#name_register").val("");
		$("#password_register").val("");
		$("#email_register").val("");
	});


	// Login l'utilisateur
	$("#button_login").click(function() {
		var name = $("#name_login").val();
		var passwd = $("#password_login").val();
		loginUser(name, passwd);
		$("#name_login").val("");
		$("#password_login").val("");
	});

	//Logout l'utilisateur
	$("#logout_icon").click(function() {
		logoutUser();
	});

});